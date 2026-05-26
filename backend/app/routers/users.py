from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from jose import JWTError

from app.database import get_db
from app.models.user import User
from app.schemas.user import UserProfile, UserUpdateRequest
from app.core.security import decode_token

router = APIRouter(prefix="/api/v1/users", tags=["users"])
bearer = HTTPBearer()


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


@router.get("/me", response_model=UserProfile)
def get_me(user: User = Depends(_get_current_user)):
    return user


@router.patch("/me", response_model=UserProfile)
def update_me(
    body: UserUpdateRequest,
    user: User = Depends(_get_current_user),
    db: Session = Depends(get_db),
):
    if body.avatar_url is not None:
        user.avatar_url = body.avatar_url
    if body.display_name is not None:
        user.display_name = body.display_name
    db.commit()
    db.refresh(user)
    return user
