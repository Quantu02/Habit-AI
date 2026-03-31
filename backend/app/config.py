import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    """Application settings loaded from environment variables"""
    
    # Database
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./habit_ai.db")
    
    # JWT
    SECRET_KEY: str = os.getenv("SECRET_KEY", "your-secret-key-change-in-production")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    # AI Models
    LSTM_MODEL_PATH: str = os.getenv("LSTM_MODEL_PATH", "./models/lstm_model.pth")
    GNN_MODEL_PATH: str = os.getenv("GNN_MODEL_PATH", "./models/gnn_model.pth")
    
    # API
    CORS_ORIGINS: list = ["http://localhost:3000", "http://localhost:8081"]
    
    class Config:
        env_file = ".env"
        case_sensitive = True

settings = Settings()
