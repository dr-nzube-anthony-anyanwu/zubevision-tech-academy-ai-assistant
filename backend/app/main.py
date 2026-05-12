from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.routes.chat import router as chat_router

app = FastAPI(
    title="ZubeVision Tech Academy AI Assistant API",
    description="Backend API for ZTAAA",
    version="1.0.0"
)

origins = [
    settings.FRONTEND_URL,
    "http://localhost:3000",
    "http://127.0.0.1:3000"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(chat_router, prefix="/api")


@app.get("/")
def root():
    return {
        "message": "ZTAAA backend is running successfully."
    }


@app.get("/health")
def health_check():
    return {
        "status": "healthy"
    }