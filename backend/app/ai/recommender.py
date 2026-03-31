import pandas as pd
import numpy as np

def get_recommendations(df):
    """
    Generate AI-powered recommendations based on habit data
    
    Args:
        df: DataFrame with habit analytics
        
    Returns:
        List of recommendation dictionaries
    """
    recommendations = []
    
    if len(df) == 0:
        return recommendations
    
    # Low consistency habits - need support
    low_consistency = df[df["consistency"] < 0.3]
    for _, row in low_consistency.iterrows():
        recommendations.append({
            "type": "support_needed",
            "habit": row["habit"],
            "message": f"'{row['habit']}' has low consistency ({row['consistency']*100:.0f}%). Try reducing difficulty or breaking it into smaller steps.",
            "priority": "high"
        })
    
    # High potential habits - ready for increase
    high_consistency = df[(df["consistency"] > 0.7) & (df["difficulty"] < 5)]
    for _, row in high_consistency.iterrows():
        recommendations.append({
            "type": "level_up",
            "habit": row["habit"],
            "message": f"Great job with '{row['habit']}'! Consider increasing difficulty from {int(row['difficulty'])} to {int(row['difficulty'])+1}.",
            "priority": "medium"
        })
    
    # Streak maintenance
    for _, row in df.iterrows():
        if row["streak"] > 10 and row["recentTrend"] > row["consistency"]:
            recommendations.append({
                "type": "streak_maintenance",
                "habit": row["habit"],
                "message": f"Your '{row['habit']}' streak is on fire ({int(row['streak'])} days)! Keep the momentum.",
                "priority": "low"
            })
    
    # Complementary habit pairs
    if len(df) > 1:
        top_habits = df.nlargest(2, "consistency")
        if len(top_habits) == 2:
            recommendations.append({
                "type": "synergy",
                "message": f"Your best habits are '{top_habits.iloc[0]['habit']}' and '{top_habits.iloc[1]['habit']}'. Stack these together!",
                "priority": "medium"
            })
    
    return recommendations

def get_insights(df):
    """
    Generate detailed insights from habit data
    
    Args:
        df: DataFrame with habit analytics
        
    Returns:
        Dictionary with various insights
    """
    insights = {}
    
    if len(df) == 0:
        return {"message": "No habit data available yet. Start logging habits!"}
    
    # Overall health score
    avg_consistency = df["consistency"].mean()
    insights["overall_health"] = round(avg_consistency * 100, 1)
    
    # Habit diversity
    insights["total_habits"] = len(df)
    insights["active_habits"] = len(df[df["consistency"] > 0])
    
    # Performance breakdown
    habits_by_performance = {
        "excellent": len(df[df["consistency"] > 0.8]),
        "good": len(df[(df["consistency"] > 0.6) & (df["consistency"] <= 0.8)]),
        "fair": len(df[(df["consistency"] > 0.3) & (df["consistency"] <= 0.6)]),
        "poor": len(df[df["consistency"] <= 0.3])
    }
    insights["performance_breakdown"] = habits_by_performance
    
    # Trend analysis
    upward = len(df[df["recentTrend"] > df["consistency"]])
    downward = len(df[df["recentTrend"] < df["consistency"]])
    insights["trend"] = {
        "improving": upward,
        "declining": downward,
        "stable": insights["total_habits"] - upward - downward
    }
    
    # Longest streak
    if "streak" in df.columns:
        longest_streak = df["streak"].max()
        longest_habit = df.loc[df["streak"].idxmax(), "habit"]
        insights["best_streak"] = {
            "habit": longest_habit,
            "days": int(longest_streak)
        }
    
    # Burnout risk
    burnout_count = len(df[df["recentTrend"] < df["consistency"] - 0.3])
    insights["burnout_risk_count"] = burnout_count
    insights["burnout_status"] = "high" if burnout_count >= 2 else ("moderate" if burnout_count == 1 else "low")
    
    return insights
