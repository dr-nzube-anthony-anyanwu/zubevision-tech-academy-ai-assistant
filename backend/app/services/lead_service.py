import re
from typing import Optional, Dict
from app.database.supabase_client import get_supabase_client


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
    patterns = [
        r"name is ([A-Za-z\s\.]+)",
        r"i am ([A-Za-z\s\.]+)",
        r"my name is ([A-Za-z\s\.]+)",
        r"full name[:\-]?\s*([A-Za-z\s\.]+)",
    ]

    for pattern in patterns:
        match = re.search(pattern, text, re.IGNORECASE)
        if match:
            return match.group(1).strip()

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


def save_lead_if_complete(text: str) -> bool:
    lead = extract_lead(text)

    if not lead:
        return False

    supabase = get_supabase_client()
    supabase.table("leads").insert(lead).execute()

    return True