from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.routes_ai import router as ai_router
from app.api.routes_analytics import router as analytics_router
from app.api.routes_auth import router as auth_router
from app.api.routes_habits import router as habits_router
from app.api.routes_social import router as social_router
from app.database import Base, engine
from app.config import settings
import asyncio
from app.services.jobs import scheduled_ai_training_job

# Create tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Habit AI System",
    description="AI-powered habit tracking and optimization platform",
    version="1.0.0"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth_router, prefix="/auth", tags=["Authentication"])
app.include_router(habits_router, prefix="/habits", tags=["Habits"])
app.include_router(ai_router, prefix="/ai", tags=["AI"])
app.include_router(analytics_router, prefix="/analytics", tags=["Analytics"])
app.include_router(social_router, prefix="/social", tags=["Social"])

@app.on_event("startup")
async def startup_event():
    asyncio.create_task(scheduled_ai_training_job())


@app.get("/")
def root():
    return {
        "status": "AI Backend Running 🚀",
        "version": "1.0.0",
        "docs": "/docs"
    }


@app.get("/health")
def health_check():
    return {"status": "healthy"}