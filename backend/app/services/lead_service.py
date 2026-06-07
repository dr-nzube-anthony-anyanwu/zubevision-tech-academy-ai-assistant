import re
import logging
from typing import Optional, Dict
from app.database.supabase_client import get_supabase_client
from app.services.notification_service import send_lead_to_make


logger = logging.getLogger(__name__)


COURSES = [
    "Full-Stack AI Engineering",
    "AI Agentic Data Science",
    "AI Agentic Data Analytics",
    "AI Automation Workflow & System Engineering",
]


def extract_email(text: str) -> Optional[str]:
    match = re.search(r"[\w\.-]+@[\w\.-]+\.\w+", text)
    return match.group(0) if match else None


def extract_phone(text: str) -> Optional[str]:
    match = re.search(r"(\+?\d[\d\s\-]{8,}\d)", text)
    return match.group(0).strip() if match else None


def extract_course(text: str) -> Optional[str]:
    lower_text = text.lower()

    for course in COURSES:
        if course.lower() in lower_text:
            return course

    if "full-stack" in lower_text or "full stack" in lower_text:
        return "Full-Stack AI Engineering"

    if "data science" in lower_text:
        return "AI Agentic Data Science"

    if "data analytics" in lower_text:
        return "AI Agentic Data Analytics"

    if "automation" in lower_text or "workflow" in lower_text:
        return "AI Automation Workflow & System Engineering"

    return None


def extract_name(text: str) -> Optional[str]:
    next_field = (
        r"(?=\s*(?:[,;\n]|"
        r"\.\s+(?=(?:and\s+)?(?:my\s+)?(?:email|phone|course)\b)|"
        r"(?:and\s+)?(?:my\s+)?(?:email|phone|course)\b|$))"
    )
    patterns = [
        rf"(?:my\s+)?name\s+is[:\-]?\s*([A-Za-z][A-Za-z .'-]*?){next_field}",
        rf"i\s+am[:\-]?\s*([A-Za-z][A-Za-z .'-]*?){next_field}",
        rf"full\s+name[:\-]?\s*([A-Za-z][A-Za-z .'-]*?){next_field}",
    ]

    for pattern in patterns:
        match = re.search(pattern, text, re.IGNORECASE)
        if match:
            return match.group(1).strip(" .")

    return None


def extract_lead(text: str) -> Optional[Dict[str, str]]:
    email = extract_email(text)
    phone = extract_phone(text)
    course = extract_course(text)
    full_name = extract_name(text)

    if email and phone and course and full_name:
        return {
            "full_name": full_name,
            "email": email,
            "phone": phone,
            "course": course,
        }

    return None


def notify_make_if_pending(supabase, lead: Dict[str, str], message: str) -> None:
    if lead["notification_sent"] or not send_lead_to_make(lead, message):
        return

    try:
        (
            supabase.table("leads")
            .update({"notification_sent": True})
            .eq("id", lead["id"])
            .execute()
        )
    except Exception:
        logger.warning(
            "Lead notification was sent, but Supabase status could not be updated."
        )


def save_lead_if_complete(text: str) -> bool:
    lead = extract_lead(text)

    if not lead:
        return False

    supabase = get_supabase_client()
    existing_response = (
        supabase.table("leads")
        .select("id, full_name, email, phone, course, notification_sent")
        .eq("full_name", lead["full_name"])
        .eq("email", lead["email"])
        .eq("phone", lead["phone"])
        .eq("course", lead["course"])
        .limit(1)
        .execute()
    )

    if existing_response.data:
        notify_make_if_pending(supabase, existing_response.data[0], text)
        return True

    response = (
        supabase.table("leads")
        .insert({**lead, "notification_sent": False})
        .select("id, full_name, email, phone, course, notification_sent")
        .execute()
    )

    saved_lead = response.data[0] if response.data else None

    if not saved_lead:
        raise RuntimeError("Supabase did not return the saved lead.")

    notify_make_if_pending(supabase, saved_lead, text)

    return True
