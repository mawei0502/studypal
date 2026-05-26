from datetime import datetime
from pydantic import BaseModel


class ConversationOut(BaseModel):
    id: str
    user_id: str
    title: str
    created_at: datetime

    model_config = {"from_attributes": True}


class MessageOut(BaseModel):
    id: str
    conversation_id: str
    role: str
    content: str
    created_at: datetime

    model_config = {"from_attributes": True}


class LearningContext(BaseModel):
    streak_days: int = 0
    level: int = 1
    completed_tasks: int = 0
    total_study_minutes: int = 0


class ChatStreamRequest(BaseModel):
    content: str
    conversation_id: str
    context: LearningContext | None = None
