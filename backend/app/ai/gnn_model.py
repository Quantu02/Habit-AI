try:
    import torch
    import torch.nn.functional as F
    from torch_geometric.nn import GCNConv

    class GNN(torch.nn.Module):
        def __init__(self):
            super().__init__()
            self.conv1 = GCNConv(4, 8)
            self.conv2 = GCNConv(8, 4)

        def forward(self, data):
            x, edge_index = data.x, data.edge_index
            x = F.relu(self.conv1(x, edge_index))
            x = self.conv2(x, edge_index)
            return torch.sigmoid(x)

except ImportError:
    # Fallback stub when torch/torch_geometric not installed
    class GNN:
        def forward(self, data):
            return []