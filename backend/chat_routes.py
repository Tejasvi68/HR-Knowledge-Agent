from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session

from database import get_db
from models import Chat, Message, User
from auth import get_current_user
from rag import ask_hr_question


router = APIRouter(prefix="/api/chats", tags=["Chat History"])


# Request Schemas
class CreateChatRequest(BaseModel):
    title: str = Field(default="New Chat", min_length=1, max_length=200)


class SendMessageRequest(BaseModel):
    message: str = Field(min_length=1, max_length=2000)


# 1. Create a New Chat
@router.post("/", status_code=status.HTTP_201_CREATED)
def create_chat(
    request: CreateChatRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    title = request.title.strip() or "New Chat"

    chat = Chat(
        title=title,
        user_id=current_user.id,
    )

    db.add(chat)
    db.commit()
    db.refresh(chat)

    return {
        "message": "Chat created successfully",
        "chat": {
            "id": chat.id,
            "title": chat.title,
            "created_at": chat.created_at,
        },
    }


# 2. Get All Chats for the Logged-in User
@router.get("/")
def get_chats(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    chats = (
        db.query(Chat)
        .filter(Chat.user_id == current_user.id)
        .order_by(Chat.updated_at.desc())
        .all()
    )

    return {
        "chats": [
            {
                "id": chat.id,
                "title": chat.title,
                "created_at": chat.created_at,
                "updated_at": chat.updated_at,
            }
            for chat in chats
        ]
    }


# 3. Get Messages from a Particular Chat
@router.get("/{chat_id}")
def get_chat_messages(
    chat_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    chat = (
        db.query(Chat)
        .filter(
            Chat.id == chat_id,
            Chat.user_id == current_user.id,
        )
        .first()
    )

    if chat is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Chat not found.",
        )

    messages = (
        db.query(Message)
        .filter(Message.chat_id == chat.id)
        .order_by(Message.id.asc())
        .all()
    )

    return {
        "chat": {
            "id": chat.id,
            "title": chat.title,
            "created_at": chat.created_at,
            "updated_at": chat.updated_at,
        },
        "messages": [
            {
                "id": message.id,
                "role": message.role,
                "content": message.content,
                "created_at": message.created_at,
            }
            for message in messages
        ],
    }


# 4. Send a Message and Save the Question and Answer
@router.post("/{chat_id}/messages")
def send_message(
    chat_id: int,
    request: SendMessageRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    question = request.message.strip()

    if not question:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Please enter a message.",
        )

    chat = (
        db.query(Chat)
        .filter(
            Chat.id == chat_id,
            Chat.user_id == current_user.id,
        )
        .first()
    )

    if chat is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Chat not found.",
        )

    try:
        result = ask_hr_question(question)
        answer = result["answer"]

        user_message = Message(
            chat_id=chat.id,
            role="user",
            content=question,
        )

        assistant_message = Message(
            chat_id=chat.id,
            role="assistant",
            content=answer,
        )

        db.add_all([user_message, assistant_message])

        if chat.title == "New Chat":
            chat.title = question[:60] + (
                "..." if len(question) > 60 else ""
            )

        chat.updated_at = datetime.now(timezone.utc)

        db.commit()

        db.refresh(user_message)
        db.refresh(assistant_message)

        return {
            "chat_id": chat.id,
            "question": {
                "id": user_message.id,
                "role": user_message.role,
                "content": user_message.content,
                "created_at": user_message.created_at,
            },
            "answer": {
                "id": assistant_message.id,
                "role": assistant_message.role,
                "content": assistant_message.content,
                "created_at": assistant_message.created_at,
            },
        }

    except Exception as exc:
        db.rollback()

        print(f"Failed to process chat message: {exc}")

        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Sorry, we could not process your message. Please try again.",
        ) from exc


# 5. Delete a Chat
@router.delete("/{chat_id}")
def delete_chat(
    chat_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    chat = (
        db.query(Chat)
        .filter(
            Chat.id == chat_id,
            Chat.user_id == current_user.id,
        )
        .first()
    )

    if chat is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Chat not found.",
        )

    db.delete(chat)
    db.commit()

    return {"message": "Chat deleted successfully"}