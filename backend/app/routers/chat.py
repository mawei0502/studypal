import json
import httpx
from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from jose import JWTError
from sse_starlette.sse import EventSourceResponse

from app.database import get_db
from app.models.user import User
from app.models.conversation import Conversation, Message
from app.schemas.chat import ConversationOut, MessageOut, ChatStreamRequest
from app.core.security import decode_token
from app.core.config import settings

router = APIRouter(prefix="/api/v1/chat", tags=["chat"])
bearer = HTTPBearer()

DEEPSEEK_API_URL = "https://api.deepseek.com/chat/completions"
MAX_HISTORY_MESSAGES = 20


def _get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(bearer),
    db: Session = Depends(get_db),
) -> User:
    try:
        payload = decode_token(credentials.credentials)
        if payload.get("type") != "access":
            raise HTTPException(status_code=401, detail="Invalid token type")
        user_id: str = payload["sub"]
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid or expired token")
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=401, detail="User not found")
    return user


def _get_or_create_conversation(user: User, db: Session) -> Conversation:
    conv = db.query(Conversation).filter(Conversation.user_id == user.id).first()
    if not conv:
        conv = Conversation(user_id=user.id)
        db.add(conv)
        db.commit()
        db.refresh(conv)
    return conv


@router.get("/conversation", response_model=ConversationOut)
def get_conversation(user: User = Depends(_get_current_user), db: Session = Depends(get_db)):
    return _get_or_create_conversation(user, db)


@router.get("/conversation/messages", response_model=list[MessageOut])
def get_messages(user: User = Depends(_get_current_user), db: Session = Depends(get_db)):
    conv = _get_or_create_conversation(user, db)
    return (
        db.query(Message)
        .filter(Message.conversation_id == conv.id)
        .order_by(Message.created_at.asc())
        .all()
    )


@router.delete("/conversation", status_code=204)
def clear_conversation(user: User = Depends(_get_current_user), db: Session = Depends(get_db)):
    conv = _get_or_create_conversation(user, db)
    db.query(Message).filter(Message.conversation_id == conv.id).delete()
    db.commit()


@router.post("/stream")
async def chat_stream(
    body: ChatStreamRequest,
    credentials: HTTPAuthorizationCredentials = Depends(bearer),
    db: Session = Depends(get_db),
):
    # Auth
    try:
        payload = decode_token(credentials.credentials)
        user_id: str = payload["sub"]
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid or expired token")

    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=401, detail="User not found")

    # Persist user message
    user_msg = Message(
        conversation_id=body.conversation_id,
        role="user",
        content=body.content,
    )
    db.add(user_msg)
    db.commit()

    # Build message history for context window
    history = (
        db.query(Message)
        .filter(Message.conversation_id == body.conversation_id)
        .order_by(Message.created_at.asc())
        .limit(MAX_HISTORY_MESSAGES)
        .all()
    )

    # Build system prompt with learning context
    ctx = body.context
    system_content = (
        "你是 StudyPal 的 AI 学习助手，专注于帮助用户制定和优化学习计划。"
        " 请用中文回复，语气友好、简洁、具体。"
    )
    if ctx:
        system_content += (
            f"\n\n当前用户学习数据："
            f"\n- 连续学习天数：{ctx.streak_days} 天"
            f"\n- 用户等级：{ctx.level}"
            f"\n- 已完成任务数：{ctx.completed_tasks} 个"
            f"\n- 累计学习时长：{ctx.total_study_minutes} 分钟"
            f"\n\n请基于以上真实数据给出个性化建议。"
        )

    messages = [{"role": "system", "content": system_content}]
    for m in history:
        messages.append({"role": m.role, "content": m.content})

    async def event_generator():
        full_response = []
        try:
            async with httpx.AsyncClient(timeout=60.0) as client:
                async with client.stream(
                    "POST",
                    DEEPSEEK_API_URL,
                    headers={
                        "Authorization": f"Bearer {settings.DEEPSEEK_API_KEY}",
                        "Content-Type": "application/json",
                    },
                    json={
                        "model": "deepseek-chat",
                        "messages": messages,
                        "stream": True,
                    },
                ) as resp:
                    if resp.status_code != 200:
                        yield {"data": json.dumps({"error": "AI 服务暂时不可用"})}
                        return

                    async for line in resp.aiter_lines():
                        if not line.startswith("data: "):
                            continue
                        chunk = line[6:]
                        if chunk == "[DONE]":
                            break
                        try:
                            data = json.loads(chunk)
                            token = data["choices"][0]["delta"].get("content", "")
                            if token:
                                full_response.append(token)
                                yield {"data": json.dumps({"token": token})}
                        except (KeyError, json.JSONDecodeError):
                            continue

        except httpx.TimeoutException:
            yield {"data": json.dumps({"error": "AI 服务响应超时"})}
        except Exception:
            yield {"data": json.dumps({"error": "AI 服务暂时不可用"})}
        finally:
            # Persist complete assistant message
            if full_response:
                assistant_msg = Message(
                    conversation_id=body.conversation_id,
                    role="assistant",
                    content="".join(full_response),
                )
                db.add(assistant_msg)
                db.commit()
            yield {"data": "[DONE]"}

    return EventSourceResponse(event_generator())
