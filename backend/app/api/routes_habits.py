from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime

from app.database import SessionLocal
from app.models import Habit, User
from app.schemas import HabitCreate, HabitUpdate, HabitResponse
from app.utils.security import get_current_user, get_db
from app.utils.helpers import calculate_streak

router = APIRouter()


@router.post("/", response_model=HabitResponse, status_code=status.HTTP_201_CREATED)
def create_habit(
    habit_data: HabitCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Create a new habit for the authenticated user"""
    new_habit = Habit(
        user_id=current_user.id,
        name=habit_data.name,
        difficulty=habit_data.difficulty,
        category=habit_data.category,
        description=habit_data.description,
        log={},
        streak=0,
    )
    db.add(new_habit)
    db.commit()
    db.refresh(new_habit)
    return new_habit


@router.get("/", response_model=List[HabitResponse])
def get_habits(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get all habits for the authenticated user"""
    habits = db.query(Habit).filter(Habit.user_id == current_user.id).all()
    return habits


@router.get("/{habit_id}", response_model=HabitResponse)
def get_habit(
    habit_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get a specific habit by ID"""
    habit = db.query(Habit).filter(
        Habit.id == habit_id,
        Habit.user_id == current_user.id
    ).first()

    if not habit:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Habit not found"
        )
    return habit


@router.put("/{habit_id}", response_model=HabitResponse)
def update_habit(
    habit_id: int,
    habit_data: HabitUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Update a habit"""
    habit = db.query(Habit).filter(
        Habit.id == habit_id,
        Habit.user_id == current_user.id
    ).first()

    if not habit:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Habit not found"
        )

    if habit_data.name is not None:
        habit.name = habit_data.name
    if habit_data.difficulty is not None:
        habit.difficulty = habit_data.difficulty
    if habit_data.category is not None:
        habit.category = habit_data.category
    if habit_data.description is not None:
        habit.description = habit_data.description

    habit.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(habit)
    return habit


@router.delete("/{habit_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_habit(
    habit_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Delete a habit"""
    habit = db.query(Habit).filter(
        Habit.id == habit_id,
        Habit.user_id == current_user.id
    ).first()

    if not habit:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Habit not found"
        )

    db.delete(habit)
    db.commit()
    return None


@router.post("/{habit_id}/log", response_model=HabitResponse)
def log_habit_completion(
    habit_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Log today's habit completion"""
    habit = db.query(Habit).filter(
        Habit.id == habit_id,
        Habit.user_id == current_user.id
    ).first()

    if not habit:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Habit not found"
        )

    today = datetime.utcnow().date().isoformat()
    log = dict(habit.log or {})
    log[today] = True
    habit.log = log

    # Recalculate streak
    habit.streak = calculate_streak(log)
    habit.updated_at = datetime.utcnow()

    # V2 Feature: Give EXP & Level Ups for consistency!
    if current_user.exp is None: current_user.exp = 0
    if current_user.level is None: current_user.level = 1
    if current_user.badges is None: current_user.badges = []
    
    current_user.exp += 20
    next_level_threshold = current_user.level * 100
    
    if current_user.exp >= next_level_threshold:
        current_user.exp = current_user.exp - next_level_threshold
        current_user.level += 1
        
        if current_user.level == 5 and "Iron Will" not in current_user.badges:
            new_badges = list(current_user.badges)
            new_badges.append("Iron Will")
            current_user.badges = new_badges

    db.commit()
    db.refresh(habit)
    return habit


@router.post("/{habit_id}/unlog", response_model=HabitResponse)
def unlog_habit_completion(
    habit_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Unlog today's habit completion"""
    habit = db.query(Habit).filter(
        Habit.id == habit_id,
        Habit.user_id == current_user.id
    ).first()

    if not habit:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Habit not found"
        )

    today = datetime.utcnow().date().isoformat()
    log = dict(habit.log or {})
    log[today] = False
    habit.log = log

    habit.streak = calculate_streak(log)
    habit.updated_at = datetime.utcnow()

    db.commit()
    db.refresh(habit)
    return habit
