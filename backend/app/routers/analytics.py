from datetime import date, datetime, timezone
from fastapi import APIRouter, Depends, HTTPException, Query
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import JWTError
from sqlalchemy import func
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.user import User
from app.models.analytics import StudyLog, Achievement, UserAchievement
from app.schemas.analytics import CalendarEntry, AchievementOut, StatsSummary, StudyLogCreate
from app.core.security import decode_token

router = APIRouter(prefix="/api/v1/analytics", tags=["analytics"])
bearer = HTTPBearer()


def _get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(bearer),
    db: Session = Depends(get_db),
) -> User:
    try:
        payload = decode_token(credentials.credentials)
        user_id: str = payload["sub"]
    except (JWTError, KeyError):
        raise HTTPException(status_code=401, detail="Invalid token")
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=401, detail="User not found")
    return user


@router.get("/stats", response_model=StatsSummary)
def get_stats(user: User = Depends(_get_current_user), db: Session = Depends(get_db)):
    """Aggregate study statistics from study_logs."""
    total = db.query(
        func.coalesce(func.sum(StudyLog.study_minutes), 0),
        func.coalesce(func.sum(StudyLog.tasks_completed), 0),
    ).filter(StudyLog.user_id == user.id).first()

    total_minutes: int = total[0] if total[0] else 0
    total_tasks: int = total[1] if total[1] else 0

    # Current streak: count consecutive days backwards from today
    logs = (
        db.query(StudyLog.date)
        .filter(StudyLog.user_id == user.id, StudyLog.study_minutes > 0)
        .order_by(StudyLog.date.desc())
        .all()
    )
    dates = [row[0] for row in logs]

    current_streak = 0
    from datetime import timedelta
    check_date = date.today()
    for d in dates:
        d_parsed = datetime.strptime(d, "%Y-%m-%d").date()
        if d_parsed == check_date:
            current_streak += 1
            check_date -= timedelta(days=1)
        elif d_parsed == check_date - timedelta(days=1):
            # Gap in logs but user studied yesterday — continue streak
            current_streak += 1
            check_date = d_parsed
        elif d_parsed < check_date - timedelta(days=1):
            break

    # Longest streak
    longest = 0
    run = 0
    prev = None
    for row in logs:
        d = datetime.strptime(row[0], "%Y-%m-%d").date()
        if prev is None:
            run = 1
        elif (prev - d).days == 1:
            run += 1
        else:
            run = 1
        prev = d
        longest = max(longest, run)

    return StatsSummary(
        total_study_minutes=total_minutes,
        completed_tasks=total_tasks,
        current_streak_days=current_streak,
        longest_streak_days=longest,
    )


@router.get("/calendar", response_model=list[CalendarEntry])
def get_calendar(
    year: int = Query(default=None, ge=2020, le=2100),
    user: User = Depends(_get_current_user),
    db: Session = Depends(get_db),
):
    if year is None:
        year = date.today().year

    logs = (
        db.query(StudyLog.date, StudyLog.study_minutes)
        .filter(
            StudyLog.user_id == user.id,
            StudyLog.date >= f"{year}-01-01",
            StudyLog.date <= f"{year}-12-31",
        )
        .order_by(StudyLog.date.asc())
        .all()
    )
    return [CalendarEntry(date=row[0], study_minutes=row[1]) for row in logs]


@router.get("/achievements", response_model=list[AchievementOut])
def get_achievements(
    user: User = Depends(_get_current_user),
    db: Session = Depends(get_db),
):
    all_achievements = db.query(Achievement).all()
    unlocked = {
        ua.achievement_id
        for ua in db.query(UserAchievement).filter(UserAchievement.user_id == user.id).all()
    }
    unlocked_records = {
        ua.achievement_id: ua.unlocked_at
        for ua in db.query(UserAchievement).filter(UserAchievement.user_id == user.id).all()
    }

    result = []
    for ach in all_achievements:
        result.append(
            AchievementOut(
                slug=ach.slug,
                title=ach.title,
                description=ach.description,
                icon_url=ach.icon_url,
                unlocked=ach.id in unlocked,
                unlocked_at=unlocked_records.get(ach.id),
            )
        )
    return result


@router.post("/study-log", status_code=201)
def create_study_log(
    body: StudyLogCreate,
    user: User = Depends(_get_current_user),
    db: Session = Depends(get_db),
):
    log_date = body.date or date.today().isoformat()

    existing = (
        db.query(StudyLog)
        .filter(StudyLog.user_id == user.id, StudyLog.date == log_date)
        .first()
    )
    if existing:
        existing.study_minutes += body.study_minutes
        existing.tasks_completed += body.tasks_completed
    else:
        existing = StudyLog(
            user_id=user.id,
            date=log_date,
            study_minutes=body.study_minutes,
            tasks_completed=body.tasks_completed,
        )
        db.add(existing)

    db.commit()
    return {"status": "ok"}
