def get_ai_insights(results, analytics, habits_data):
    """
    Generate high-level AI insights combining brain analysis and analytics
    
    Args:
        results: Results from AI brain analysis
        analytics: Results from analytics engine
        habits_data: Original habits data
        
    Returns:
        Dictionary with AI insights
    """
    insights = {
        "summary": {},
        "recommendations": [],
        "patterns": [],
        "alerts": []
    }
    
    # Build summary
    if results and len(results) > 0:
        top_performer = max(results, key=lambda x: x["score"])
        insights["summary"]["top_performer"] = top_performer
        insights["summary"]["avg_score"] = round(sum(r["score"] for r in results) / len(results), 1)
    
    # Detect patterns
    if "difficulty" in str(results):
        increasing_difficulty = [r for r in results if "→ " in str(r.get("difficulty", ""))]
        if len(increasing_difficulty) > 0:
            insights["patterns"].append({
                "type": "difficulty_progression",
                "count": len(increasing_difficulty),
                "message": f"{len(increasing_difficulty)} habits showing improved difficulty progression"
            })
    
    # Burnout alerts
    if analytics and "burnout_risk" in analytics:
        for habit in analytics["burnout_risk"]:
            insights["alerts"].append({
                "type": "burnout_warning",
                "habit": habit,
                "severity": "high",
                "message": f"⚠️ {habit} shows signs of burnout. Consider reducing difficulty or taking a break."
            })
    
    # Consistency alerts
    if analytics and "impact_scores" in analytics:
        weak_habits = [h for h in analytics["impact_scores"] if h["impact"] < 30]
        if len(weak_habits) > 0:
            insights["alerts"].append({
                "type": "consistency_warning",
                "message": f"{len(weak_habits)} habit(s) have low impact scores. Review your logging data.",
                "severity": "medium"
            })
    
    return insights

def generate_weekly_summary(habits_data, results, analytics):
    """Generate weekly summary report"""
    summary = {
        "week_ending": "",
        "total_habits": len(habits_data) if habits_data else 0,
        "avg_consistency": analytics.get("summary", {}).get("avg_consistency", 0) if analytics else 0,
        "best_habit": analytics.get("best", "") if analytics else "",
        "burnout_risks": len(analytics.get("burnout_risk", [])) if analytics else 0,
        "ai_score": round(sum(r.get("score", 0) for r in results) / len(results), 1) if results else 0,
        "recommendations_count": 0
    }
    return summary
