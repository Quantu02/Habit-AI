from pydantic import BaseModel, EmailStr
from typing import Dict, List, Optional
from datetime import datetime

class HabitLog(BaseModel):
    """Individual habit completion log"""
    date: str
    completed: bool

class HabitCreate(BaseModel):
    """Schema for creating a habit"""
    name: str
    difficulty: int = 3  # 1-5 scale
    category: Optional[str] = None
    description: Optional[str] = None

class HabitUpdate(BaseModel):
    """Schema for updating a habit"""
    name: Optional[str] = None
    difficulty: Optional[int] = None
    category: Optional[str] = None
    description: Optional[str] = None

class HabitResponse(BaseModel):
    """Schema for habit response"""
    id: int
    name: str
    streak: int
    difficulty: int
    log: Dict[str, bool]
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True

class UserRegister(BaseModel):
    """Schema for user registration"""
    email: EmailStr
    username: str
    password: str

class UserLogin(BaseModel):
    """Schema for user login"""
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    """Schema for user response"""
    id: int
    email: str
    username: str
    exp: int
    level: int
    badges: List[str]
    created_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True

class TokenResponse(BaseModel):
    """Schema for token response"""
    access_token: str
    token_type: str = "bearer"
    user: UserResponse

class AIBrainRequest(BaseModel):
    """Schema for AI brain analysis request"""
    habits: List[Dict]

class AIBrainResponse(BaseModel):
    """Schema for AI brain analysis response"""
    habit: str
    score: int
    difficulty: str

class AnalyticsResponse(BaseModel):
    """Schema for analytics response"""
    summary: Dict
    best: str
    worst: str
    burnout_risk: List[str]
    impact_scores: List[Dict]

class NotificationSchema(BaseModel):
    """Schema for notifications"""
    user_id: int
    type: str
    message: str
    read: bool = False
    created_at: Optional[datetime] = None

class PushTokenRequest(BaseModel):
    """Schema for updating push token"""
    token: str
