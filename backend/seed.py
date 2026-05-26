"""Seed a default user account for StudyPal."""
from app.database import SessionLocal, engine, Base
from app.models.user import User
from app.core.security import hash_password

# Ensure tables created
Base.metadata.create_all(bind=engine)

db = SessionLocal()
try:
    existing = db.query(User).filter(User.email == "demo@studypal.com").first()
    if existing:
        print(f"Default user already exists: {existing.email}")
    else:
        user = User(
            email="demo@studypal.com",
            hashed_password=hash_password("12345678"),
            display_name="Demo User",
            current_streak_days=7,
            level=3,
        )
        db.add(user)
        db.commit()
        print(f"Created default user: {user.email}")
finally:
    db.close()
