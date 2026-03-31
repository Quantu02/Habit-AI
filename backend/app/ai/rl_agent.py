import random
import numpy as np

class RLAgent:
    def __init__(self):
        self.q = {}

    def key(self, s):
        return (round(s["consistency"],1), s["streak"]//3, s["difficulty"])

    def act(self, s):
        k = self.key(s)
        if k not in self.q:
            self.q[k] = [0,0,0]

        if random.random() < 0.2:
            return random.randint(0,2)

        return int(np.argmax(self.q[k]))

    def update(self, s,a,r,ns):
        k = self.key(s)
        if k not in self.q:
            self.q[k] = [0,0,0]

        self.q[k][a] += 0.1*(r - self.q[k][a])