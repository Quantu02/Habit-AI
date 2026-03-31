try:
    import torch
    import torch.nn as nn

    class LSTM(nn.Module):
        def __init__(self):
            super().__init__()
            self.lstm = nn.LSTM(1, 16, batch_first=True)
            self.fc = nn.Linear(16, 1)

        def forward(self, x):
            out, _ = self.lstm(x)
            out = out[:, -1, :]
            return torch.sigmoid(self.fc(out))

    model = LSTM()

    def predict(seq):
        x = torch.tensor(seq).float().view(1, -1, 1)
        return model(x).item()

except ImportError:
    # Fallback when torch is not installed — use simple average
    def predict(seq):
        return sum(seq) / len(seq) if seq else 0.5