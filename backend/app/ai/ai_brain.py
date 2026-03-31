from app.ai.rl_agent import RLAgent
from app.ai.lstm_model import predict

agent = RLAgent()

def run_ai(df):
    results = []

    for _,row in df.iterrows():
        time_score = predict([row["consistency"]]*10)

        state = {
            "consistency": row["consistency"],
            "streak": row["streak"],
            "difficulty": row["difficulty"]
        }

        action = agent.act(state)

        if action == 0:
            new_diff = max(1, state["difficulty"]-1)
        elif action == 2:
            new_diff = min(5, state["difficulty"]+1)
        else:
            new_diff = state["difficulty"]

        reward = 1 if row["completed"] else -1
        agent.update(state, action, reward, state)

        results.append({
            "habit": row["habit"],
            "score": int(time_score*100),
            "difficulty": f"{state['difficulty']} → {new_diff}"
        })

    return results