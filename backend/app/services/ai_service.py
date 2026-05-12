import httpx
from app.config import settings
from app.prompts.system_prompt import SYSTEM_PROMPT
from app.services.knowledge_service import load_knowledge_base


async def generate_ai_response(user_message: str, history: list) -> str:
    knowledge_base = load_knowledge_base()

    messages = [
        {
            "role": "system",
            "content": f"{SYSTEM_PROMPT}\n\nKNOWLEDGE BASE:\n{knowledge_base}"
        }
    ]

    for item in history[-8:]:
        messages.append({
            "role": item.role,
            "content": item.content
        })

    messages.append({
        "role": "user",
        "content": user_message
    })

    headers = {
        "Authorization": f"Bearer {settings.OPENROUTER_API_KEY}",
        "Content-Type": "application/json",
        "HTTP-Referer": "http://localhost:3000",
        "X-Title": "ZubeVision Tech Academy AI Assistant"
    }

    payload = {
        "model": settings.OPENROUTER_MODEL,
        "messages": messages,
        "temperature": 0.4,
        "max_tokens": 700
    }

    async with httpx.AsyncClient(timeout=60) as client:
        response = await client.post(
            settings.OPENROUTER_BASE_URL,
            headers=headers,
            json=payload
        )

    if response.status_code != 200:
        raise Exception(f"OpenRouter error: {response.text}")

    data = response.json()

    return data["choices"][0]["message"]["content"]