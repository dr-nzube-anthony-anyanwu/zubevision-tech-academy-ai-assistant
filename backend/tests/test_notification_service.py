import unittest
from unittest.mock import Mock, patch

import httpx

from app.services.notification_service import send_lead_to_make


LEAD = {
    "full_name": "Ada Lovelace",
    "email": "ada@example.com",
    "phone": "+234 800 000 0000",
    "course": "Full-Stack AI Engineering",
}


class SendLeadToMakeTests(unittest.TestCase):
    @patch("app.services.notification_service.httpx.post")
    @patch("app.services.notification_service.settings")
    def test_sends_make_compatible_payload(self, mock_settings, mock_post):
        mock_settings.MAKE_WEBHOOK_URL = "https://hook.example.test/lead"
        response = Mock()
        response.raise_for_status.return_value = None
        mock_post.return_value = response

        sent = send_lead_to_make(LEAD, "I would like to enroll.")

        self.assertTrue(sent)
        mock_post.assert_called_once_with(
            "https://hook.example.test/lead",
            json={
                "full_name": "Ada Lovelace",
                "email": "ada@example.com",
                "phone": "+234 800 000 0000",
                "course_of_interest": "Full-Stack AI Engineering",
                "message": "I would like to enroll.",
                "source": "ZubeVision Tech Academy AI Assistant",
            },
            timeout=10.0,
        )

    @patch("app.services.notification_service.httpx.post")
    @patch("app.services.notification_service.settings")
    def test_returns_false_when_make_fails(self, mock_settings, mock_post):
        mock_settings.MAKE_WEBHOOK_URL = "https://hook.example.test/lead"
        mock_post.side_effect = httpx.ConnectError("unavailable")

        self.assertFalse(send_lead_to_make(LEAD, "Message"))

    @patch("app.services.notification_service.httpx.post")
    @patch("app.services.notification_service.settings")
    def test_skips_when_webhook_is_not_configured(self, mock_settings, mock_post):
        mock_settings.MAKE_WEBHOOK_URL = ""

        self.assertFalse(send_lead_to_make(LEAD, "Message"))
        mock_post.assert_not_called()


if __name__ == "__main__":
    unittest.main()
