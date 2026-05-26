from datetime import datetime
from pydantic import BaseModel, HttpUrl, field_validator


class UserProfile(BaseModel):
    id: str
    email: str
    display_name: str
    avatar_url: str | None
    current_streak_days: int
    level: int
    created_at: datetime

    model_config = {"from_attributes": True}


class UserUpdateRequest(BaseModel):
    avatar_url: str | None = None
    display_name: str | None = None

    @field_validator("avatar_url")
    @classmethod
    def validate_avatar_url(cls, v: str | None) -> str | None:
        if v is not None and not (v.startswith("http://") or v.startswith("https://")):
            raise ValueError("avatar_url must start with http:// or https://")
        return v

    @field_validator("display_name")
    @classmethod
    def validate_display_name(cls, v: str | None) -> str | None:
        if v is not None and not (1 <= len(v) <= 50):
            raise ValueError("display_name must be 1–50 characters")
        return v
