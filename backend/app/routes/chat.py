from fastapi import APIRouter, HTTPException
from app.models import ChatRequest, ChatResponse
from app.services.ai_service import generate_ai_response
from app.services.lead_service import save_lead_if_complete
from app.database.supabase_client import get_supabase_client

router = APIRouter()


@router.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    try:
        ai_response = await generate_ai_response(
            user_message=request.message,
            history=request.history or []
        )

        lead_saved = save_lead_if_complete(request.message)

        supabase = get_supabase_client()
        supabase.table("chats").insert({
            "user_message": request.message,
            "ai_response": ai_response
        }).execute()

        return ChatResponse(
            response=ai_response,
            lead_saved=lead_saved
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))