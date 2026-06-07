import logging
from typing import Dict

import httpx

from app.config import settings


logger = logging.getLogger(__name__)

SOURCE_NAME = "ZubeVision Tech Academy AI Assistant"
WEBHOOK_TIMEOUT_SECONDS = 10.0


def send_lead_to_make(lead: Dict[str, str], message: str) -> bool:
    if not settings.MAKE_WEBHOOK_URL:
        logger.warning("MAKE_WEBHOOK_URL is not configured; lead notification skipped.")
        return False

    payload = {
        "full_name": lead["full_name"],
        "email": lead["email"],
        "phone": lead["phone"],
        "course_of_interest": lead["course"],
        "message": message,
        "source": SOURCE_NAME,
    }

    try:
        response = httpx.post(
            settings.MAKE_WEBHOOK_URL,
            json=payload,
            timeout=WEBHOOK_TIMEOUT_SECONDS,
        )
        response.raise_for_status()
    except httpx.HTTPError:
        logger.warning("Make webhook request failed; notification remains pending.")
        return False

    return True
