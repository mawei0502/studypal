from pydantic import BaseModel
from datetime import datetime


class CalendarEntry(BaseModel):
    date: str
    study_minutes: int

    class Config:
        from_attributes = True


class AchievementOut(BaseModel):
    slug: str
    title: str
    description: str
    icon_url: str | None = None
    unlocked: bool = False
    unlocked_at: datetime | None = None

    class Config:
        from_attributes = True


class StatsSummary(BaseModel):
    total_study_minutes: int = 0
    completed_tasks: int = 0
    current_streak_days: int = 0
    longest_streak_days: int = 0


class StudyLogCreate(BaseModel):
    study_minutes: int = 0
    tasks_completed: int = 0
    date: str | None = None  # defaults to today
