import pandas as pd

def build_features(habits):
    rows = []

    for h in habits:
        logs = h["log"]
        values = list(logs.values())

        if not values:
            continue

        df = pd.DataFrame({"done": values})
        df["rolling"] = df["done"].rolling(7).mean().fillna(0)

        rows.append({
            "habit": h["name"],
            "consistency": df["done"].mean(),
            "recentTrend": df["rolling"].iloc[-1],
            "streak": h["streak"],
            "difficulty": h.get("difficulty", 3),
            "completed": values[-1]
        })

    return pd.DataFrame(rows)