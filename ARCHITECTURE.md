# Habit-AI System Architecture

## High-Level System Design

```
┌─────────────────────────────────────────────────────────────┐
│                     Client Layer                             │
├──────────────────────┬──────────────────────┬────────────────┤
│   Web Browser        │   Mobile App         │   Admin Panel  │
│   (React)            │   (React Native)     │   (React)      │
└──────────┬───────────┴──────────┬───────────┴────────┬───────┘
           │                      │                    │
           └──────────────────────┼────────────────────┘
                                  │
                          HTTP/REST API
                                  │
┌─────────────────────────────────┴────────────────────────────┐
│                    API Gateway (FastAPI)                      │
│  ┌────────────────────────────────────────────────────────┐  │
│  │  Routes: /auth, /api, /analytics                       │  │
│  │  Features: CORS, JWT Auth, Request Validation         │  │
│  └────────────────────────────────────────────────────────┘  │
└──────────┬────────────────────────────┬────────────────────┬─┘
           │                            │                    │
    ┌──────▼──────┐         ┌──────────▼──────┐    ┌────────▼────────┐
    │   AI Brain   │         │    Services     │    │   Data Layer    │
    │   System     │         │                 │    │                 │
    └──────────────┘         └─────────────────┘    └────────────────┘
```

## Backend Architecture

### Layer 1: API Layer (routes_*.py)
- **routes_auth.py**: Authentication endpoints
- **routes_ai.py**: AI analysis endpoints
- **routes_analytics.py**: Analytics endpoints

### Layer 2: Business Logic (services/*, ai/*)
- **Auth Service**: Token management, password hashing
- **Notification Service**: User alerts and updates
- **AI Brain**: Orchestrates ML models

### Layer 3: AI/ML Models
- **LSTM Model**: Temporal prediction
- **RL Agent**: Adaptive difficulty
- **GNN**: Relationship mapping
- **Recommender**: Suggestions
- **Insights**: Analytics

### Layer 4: Data Access (models.py, database.py)
- **SQLAlchemy ORM**: Database abstraction
- **Models**: User, Habit, Notification
- **Sessions**: Connection management

### Layer 5: Utilities (utils/*)
- **helpers.py**: Streak calculation, stats
- **security.py**: Token verification

## Data Flow

### Habit Tracking Flow
```
User Input (Mobile/Web)
    ↓
REST API (/ai/brain)
    ↓
Feature Engineering (extract consistency, streak, trend)
    ↓
LSTM Model (predict completion likelihood)
    ↓
RL Agent (determine difficulty adjustment)
    ↓
Score & Recommendation
    ↓
Database Storage
    ↓
User Dashboard
```

### Analytics Flow
```
User Request (/analytics/)
    ↓
Feature Engineering
    ↓
Calculate Metrics (consistency, best/worst, burnout)
    ↓
Analytics Response
    ↓
Frontend Visualization
```

## Frontend Architecture

### Component Hierarchy
```
App (Router)
├── Login Page
│   └── Authentication Form
└── Dashboard Page
    ├── Navigation Sidebar
    └── Main Content Area
        ├── Overview Tab
        │   └── AIInsights
        ├── Brain Tab
        │   └── BrainPanel
        ├── Premium Tab
        │   └── PremiumDashboard
        └── Habits Tab
            └── Habit List & Form
```

### State Management
- **React Hooks**: useState, useEffect
- **Context API**: User authentication
- **Local Storage**: Token persistence
- **Custom Hooks**: useAnalytics

### API Integration
- **Axios Instance**: Centralized HTTP client
- **Interceptors**: Token injection, error handling
- **Services**: aiService.js for AI endpoints

## Database Schema

### Users Table
```sql
CREATE TABLE users (
    id INT PRIMARY KEY,
    email VARCHAR UNIQUE,
    username VARCHAR UNIQUE,
    hashed_password VARCHAR,
    created_at TIMESTAMP,
    updated_at TIMESTAMP
)
```

### Habits Table
```sql
CREATE TABLE habits (
    id INT PRIMARY KEY,
    user_id INT FOREIGN KEY,
    name VARCHAR,
    streak INT,
    difficulty INT,
    category VARCHAR,
    log JSON,  -- {date: boolean}
    created_at TIMESTAMP,
    updated_at TIMESTAMP
)
```

### Notifications Table
```sql
CREATE TABLE notifications (
    id INT PRIMARY KEY,
    user_id INT FOREIGN KEY,
    type VARCHAR,  -- achievement, burnout_warning, recommendation
    message VARCHAR,
    read BOOLEAN,
    created_at TIMESTAMP
)
```

## API Contract

### Request/Response Format

**Request:**
```json
{
    "habits": [
        {
            "name": "Morning Run",
            "streak": 15,
            "difficulty": 3,
            "log": {
                "2024-01-01": true,
                "2024-01-02": false,
                "2024-01-03": true
            }
        }
    ]
}
```

**Response (AI Brain):**
```json
{
    "results": [
        {
            "habit": "Morning Run",
            "score": 78,
            "difficulty": "3 → 4"
        }
    ]
}
```

**Response (Analytics):**
```json
{
    "summary": {
        "avg_consistency": 75.5
    },
    "best": "Morning Run",
    "worst": "Reading",
    "burnout_risk": [],
    "impact_scores": [
        {
            "habit": "Morning Run",
            "impact": 75.2
        }
    ]
}
```

## Authentication Flow

```
1. User Registration/Login
        ↓
2. Credentials Validation
        ↓
3. JWT Token Generation
        ↓
4. Token Storage (LocalStorage/AsyncStorage)
        ↓
5. Token Included in API Requests
        ↓
6. Server Validates Token
        ↓
7. Request Processed
        ↓
8. Response Returned
```

## Deployment Architecture

### Development
```
Docker Container (Backend)
    - SQLite Database
    - Hot reload enabled
    - Debug logging

Docker Container (Frontend)
    - React Dev Server
    - Hot Module Replacement
    - Source Maps
```

### Production
```
PostgreSQL Database
    ↑
Docker Container (Backend)
    - Uvicorn ASGI Server
    - Environment-based config
    - Health checks

Reverse Proxy (nginx)
    ↓
Docker Container (Frontend)
    - Static file serving
    - Gzip compression
    - Cache headers
```

## Security Layers

### Application Level
- JWT token validation on every request
- Bcrypt password hashing
- Input validation (Pydantic schemas)

### Transport Level
- HTTPS ready (configure in reverse proxy)
- CORS policies

### Data Level
- SQLAlchemy ORM (SQL injection prevention)
- Parameterized queries
- Database user permissions

## Performance Optimization

### Backend
- Database indexing on user_id, email
- Query optimization with SQLAlchemy
- Connection pooling
- Model caching

### Frontend
- Code splitting (React Router)
- Lazy loading components
- CSS minification
- Image optimization

### Mobile
- Incremental app updates
- Native module caching
- Memory optimization

## Scalability Considerations

### Horizontal Scaling
- Stateless API design
- Database connection pooling
- CDN for static assets
- Load balancer ready

### Vertical Scaling
- Async file operations
- Background task queues (Celery ready)
- Caching layer (Redis ready)
- Database replication (PostgreSQL ready)

## Monitoring & Logging

### Application Monitoring
- Health check endpoint: `/health`
- Request logging
- Error tracking
- Performance metrics

### Infrastructure Monitoring
- Docker health checks
- Database connection monitoring
- API response time tracking
- Error rate monitoring

---

**This architecture is designed to be:**
- ✅ Scalable - From single server to distributed
- ✅ Maintainable - Clear separation of concerns
- ✅ Secure - Multiple security layers
- ✅ Performant - Optimized at all levels
- ✅ Flexible - Easy to extend and modify
