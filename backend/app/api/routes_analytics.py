from fastapi import APIRouter
from app.ai.features import build_features

router = APIRouter()

@router.post("/")
def analytics(data: dict):
    df = build_features(data["habits"])

    if len(df)==0:
        return {"error":"no data"}

    best = df.loc[df["consistency"].idxmax()]
    worst = df.loc[df["consistency"].idxmin()]

    # Advanced metrics
    burnout = []
    for _,row in df.iterrows():
        if row["recentTrend"] < row["consistency"] - 0.3:
            burnout.append(row["habit"])

    impact_scores = []
    for _,row in df.iterrows():
        score = 0.6*row["consistency"] + 0.4*row["recentTrend"]
        impact_scores.append({
            "habit": row["habit"],
            "impact": round(score*100,1)
        })

    return {
        "summary":{
            "avg_consistency": round(df["consistency"].mean()*100,1)
        },
        "best": best["habit"],
        "worst": worst["habit"],
        "burnout_risk": burnout,
        "impact_scores": impact_scores
    }