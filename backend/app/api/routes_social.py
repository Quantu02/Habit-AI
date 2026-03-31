from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List

from app.utils.security import get_db, get_current_user
from app.models import User
from app.schemas import UserResponse

router = APIRouter()

@router.get("/leaderboard", response_model=List[UserResponse])
def get_leaderboard(
    db: Session = Depends(get_db)
):
    """Fetch top 10 strongest Habit-AI users based on EXP Global Ranking"""
    top_users = db.query(User).order_by(User.exp.desc()).limit(10).all()
    return top_users
