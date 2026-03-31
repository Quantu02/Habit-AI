from fastapi import APIRouter
from app.ai.features import build_features
from app.ai.ai_brain import run_ai
from app.ai.recommender import get_recommendations, get_insights
from app.ai.insights import get_ai_insights

router = APIRouter()


@router.post("/brain")
def ai_brain(data: dict):
    """Run full AI brain analysis on habits"""
    habits = data.get("habits", [])
    if not habits:
        return {"results": []}
    df = build_features(habits)
    return {"results": run_ai(df)}


@router.post("/recommendations")
def ai_recommendations(data: dict):
    """Get AI-powered habit recommendations"""
    habits = data.get("habits", [])
    if not habits:
        return {"recommendations": []}
    df = build_features(habits)
    recommendations = get_recommendations(df)
    return {"recommendations": recommendations}


@router.post("/insights")
def ai_insights(data: dict):
    """Get high-level AI insights combining brain analysis and analytics"""
    habits = data.get("habits", [])
    results = data.get("results", [])
    analytics = data.get("analytics", {})

    if not habits:
        return {
            "summary": {},
            "recommendations": [],
            "patterns": [],
            "alerts": []
        }

    df = build_features(habits)
    summary_insights = get_insights(df)
    ai_data = get_ai_insights(results, analytics, habits)

    # Merge insights
    ai_data["habit_summary"] = summary_insights
    return ai_data