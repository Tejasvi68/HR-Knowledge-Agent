from fastapi import FastAPI, HTTPException, Depends
from pydantic import BaseModel, Field
from chat_routes import router as chat_router
from fastapi.middleware.cors import CORSMiddleware
from database import Base, engine
from auth import (
    router as auth_router,
    get_current_user
)
from models import User
from rag import ask_hr_question

# Import models before creating database tables
import models


# Initialize FastAPI application
app = FastAPI(
    title="HR Knowledge Agent",
    description="AI-powered HR policy assistant",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5174",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Create database tables if they don't exist
Base.metadata.create_all(bind=engine)


# Register authentication endpoints
app.include_router(auth_router)
app.include_router(chat_router)


# Request model
class HRQuestion(BaseModel):
    question: str = Field(min_length=1, max_length=2000)


# Home endpoint
@app.get("/")
def home():
    return {
        "message": "HR Knowledge Agent API is running"
    }


# Health check endpoint
@app.get("/api/health")
def health():
    return {
        "status": "healthy"
    }


# Authenticated HR question endpoint
@app.post("/api/hr/ask")
def ask_hr(
    request: HRQuestion,
    current_user: User = Depends(get_current_user)
):
    question = request.question.strip()

    if not question:
        raise HTTPException(
            status_code=400,
            detail="Please enter an HR question."
        )

    try:
        result = ask_hr_question(question)

        return {
            "answer": result["answer"]
        }

    except Exception as exc:
        # Log the actual error for debugging
        print(f"HR question processing failed: {exc}")

        raise HTTPException(
            status_code=500,
            detail="Sorry, we could not process your question. Please try again."
        )

