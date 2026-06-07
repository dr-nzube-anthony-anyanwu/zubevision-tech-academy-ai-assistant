import unittest
from unittest.mock import Mock, patch

from app.services.lead_service import extract_name, save_lead_if_complete


class Query:
    def __init__(self, response=None):
        self.response = response
        self.payload = None
        self.filters = []

    def insert(self, payload):
        self.payload = payload
        return self

    def select(self, _columns):
        return self

    def update(self, payload):
        self.payload = payload
        return self

    def eq(self, column, value):
        self.filters.append((column, value))
        return self

    def limit(self, _count):
        return self

    def execute(self):
        return self.response


class Supabase:
    def __init__(self, existing_response, insert_response=None):
        self.existing_query = Query(existing_response)
        self.insert_query = Query(insert_response)
        self.update_query = Query(Mock(data=[]))
        self.has_existing_lead = bool(existing_response.data)
        self.calls = 0

    def table(self, table_name):
        assert table_name == "leads"
        self.calls += 1
        if self.calls == 1:
            return self.existing_query
        if self.has_existing_lead:
            return self.update_query
        return self.insert_query if self.calls == 2 else self.update_query


COMPLETE_MESSAGE = (
    "My name is Ada Lovelace. My email is ada@example.com, "
    "my phone is +234 800 000 0000, and I want Full-Stack AI Engineering."
)


class SaveLeadTests(unittest.TestCase):
    def test_extracts_name_without_the_next_field(self):
        self.assertEqual(
            extract_name("My name is Ada Lovelace. My email is ada@example.com."),
            "Ada Lovelace",
        )

    def test_extracts_name_from_multiline_details(self):
        self.assertEqual(
            extract_name("Full name: Anthony N. Anyanwu\nEmail: admin@example.com"),
            "Anthony N. Anyanwu",
        )

    @patch("app.services.lead_service.send_lead_to_make", return_value=True)
    @patch("app.services.lead_service.get_supabase_client")
    def test_marks_notification_sent_after_success(self, get_client, send_to_make):
        saved_lead = {
            "id": 42,
            "full_name": "Ada Lovelace",
            "email": "ada@example.com",
            "phone": "+234 800 000 0000",
            "course": "Full-Stack AI Engineering",
            "notification_sent": False,
        }
        supabase = Supabase(Mock(data=[]), Mock(data=[saved_lead]))
        get_client.return_value = supabase

        self.assertTrue(save_lead_if_complete(COMPLETE_MESSAGE))

        self.assertEqual(
            supabase.existing_query.filters,
            [
                ("full_name", "Ada Lovelace"),
                ("email", "ada@example.com"),
                ("phone", "+234 800 000 0000"),
                ("course", "Full-Stack AI Engineering"),
            ],
        )
        self.assertEqual(supabase.insert_query.payload["notification_sent"], False)
        send_to_make.assert_called_once_with(saved_lead, COMPLETE_MESSAGE)
        self.assertEqual(
            supabase.update_query.payload,
            {"notification_sent": True},
        )
        self.assertEqual(supabase.update_query.filters, [("id", 42)])

    @patch("app.services.lead_service.send_lead_to_make", return_value=False)
    @patch("app.services.lead_service.get_supabase_client")
    def test_lead_stays_pending_when_make_fails(self, get_client, send_to_make):
        saved_lead = {
            "id": 42,
            "full_name": "Ada Lovelace",
            "email": "ada@example.com",
            "phone": "+234 800 000 0000",
            "course": "Full-Stack AI Engineering",
            "notification_sent": False,
        }
        supabase = Supabase(Mock(data=[]), Mock(data=[saved_lead]))
        get_client.return_value = supabase

        self.assertTrue(save_lead_if_complete(COMPLETE_MESSAGE))

        send_to_make.assert_called_once()
        self.assertEqual(supabase.calls, 2)

    @patch("app.services.lead_service.send_lead_to_make")
    @patch("app.services.lead_service.get_supabase_client")
    def test_does_not_duplicate_an_already_notified_lead(
        self, get_client, send_to_make
    ):
        existing_lead = {
            "id": 42,
            "full_name": "Ada Lovelace",
            "email": "ada@example.com",
            "phone": "+234 800 000 0000",
            "course": "Full-Stack AI Engineering",
            "notification_sent": True,
        }
        supabase = Supabase(Mock(data=[existing_lead]))
        get_client.return_value = supabase

        self.assertTrue(save_lead_if_complete(COMPLETE_MESSAGE))

        send_to_make.assert_not_called()
        self.assertEqual(supabase.calls, 1)

    @patch("app.services.lead_service.send_lead_to_make", return_value=True)
    @patch("app.services.lead_service.get_supabase_client")
    def test_retries_notification_for_an_existing_pending_lead(
        self, get_client, send_to_make
    ):
        existing_lead = {
            "id": 42,
            "full_name": "Ada Lovelace",
            "email": "ada@example.com",
            "phone": "+234 800 000 0000",
            "course": "Full-Stack AI Engineering",
            "notification_sent": False,
        }
        supabase = Supabase(Mock(data=[existing_lead]))
        get_client.return_value = supabase

        self.assertTrue(save_lead_if_complete(COMPLETE_MESSAGE))

        send_to_make.assert_called_once_with(existing_lead, COMPLETE_MESSAGE)
        self.assertEqual(
            supabase.update_query.payload,
            {"notification_sent": True},
        )

    @patch("app.services.lead_service.get_supabase_client")
    def test_does_nothing_for_an_incomplete_lead(self, get_client):
        self.assertFalse(save_lead_if_complete("Tell me about your courses."))
        get_client.assert_not_called()


if __name__ == "__main__":
    unittest.main()
