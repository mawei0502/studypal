"""Seed initial achievements into the database."""
from app.database import SessionLocal, engine, Base
from app.models.analytics import Achievement

# Ensure tables created
Base.metadata.create_all(bind=engine)

db = SessionLocal()
try:
    existing = db.query(Achievement).count()
    if existing > 0:
        print(f"Already have {existing} achievements, skipping seed.")
    else:
        achievements = [
            Achievement(
                slug="first_login",
                title="首次登录",
                description="首次登录 StudyPal",
                condition_type="streak_days",
                condition_value=0,
            ),
            Achievement(
                slug="streak_3",
                title="初级自律者",
                description="连续学习 3 天",
                condition_type="streak_days",
                condition_value=3,
            ),
            Achievement(
                slug="streak_7",
                title="周冠军",
                description="连续学习 7 天",
                condition_type="streak_days",
                condition_value=7,
            ),
            Achievement(
                slug="streak_30",
                title="月度达人",
                description="连续学习 30 天",
                condition_type="streak_days",
                condition_value=30,
            ),
            Achievement(
                slug="minutes_100",
                title="初学者",
                description="累计学习 100 分钟",
                condition_type="total_minutes",
                condition_value=100,
            ),
            Achievement(
                slug="minutes_1000",
                title="学习达人",
                description="累计学习 1000 分钟",
                condition_type="total_minutes",
                condition_value=1000,
            ),
            Achievement(
                slug="tasks_10",
                title="任务新手",
                description="完成 10 个学习任务",
                condition_type="total_tasks",
                condition_value=10,
            ),
            Achievement(
                slug="tasks_50",
                title="任务能手",
                description="完成 50 个学习任务",
                condition_type="total_tasks",
                condition_value=50,
            ),
        ]
        db.add_all(achievements)
        db.commit()
        print(f"Seeded {len(achievements)} achievements.")
finally:
    db.close()
