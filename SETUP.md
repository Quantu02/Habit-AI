# Habit-AI Project SETUP GUIDE

## Quick Start

### 1. Backend Setup

```bash
cd backend
pip install -r requirements.txt
cp .env.example .env
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Backend runs on: http://localhost:8000
API Docs: http://localhost:8000/docs

### 2. Frontend Setup

```bash
cd frontend
npm install
cp .env.example .env
npm start
```

Frontend runs on: http://localhost:3000

### 3. Mobile Setup

```bash
cd mobile
npm install
cp .env.example .env
npm start
# or
npm run ios    # For iOS
npm run android # For Android
```

## Docker Setup

### Single Compose (Development)
```bash
docker-compose up
```

### Production Setup
```bash
docker-compose -f docker-compose.prod.yml up -d
```

## Project Features

✅ AI-powered habit tracking
✅ Adaptive difficulty system
✅ Burnout detection
✅ LSTM time-series prediction
✅ Graph neural networks
✅ Personalized recommendations
✅ Cross-platform (Web & Mobile)

## Key Files

### Backend
- `backend/app/main.py` - FastAPI entry point
- `backend/app/ai/ai_brain.py` - Main AI orchestration
- `backend/app/api/routes_*.py` - API endpoints
- `backend/requirements.txt` - Python dependencies

### Frontend
- `frontend/src/App.js` - React entry point
- `frontend/src/pages/` - Page components
- `frontend/src/components/` - Reusable components
- `frontend/src/services/` - API services

### Mobile
- `mobile/app/App.js` - React Native entry point
- `mobile/app/screens/` - Screen components
- `mobile/package.json` - Dependencies

## Database

### Local Development
Uses SQLite: `./habit_ai.db`

### Production
Uses PostgreSQL (see docker-compose.prod.yml)

## Environment Variables

Create `.env` files in backend, frontend, and mobile directories:

Backend: `backend/.env`
Frontend: `frontend/.env`
Mobile: `mobile/.env`

See `.env.example` files for reference.

## Testing

```bash
# Backend tests
cd backend
pytest

# Frontend tests
cd frontend
npm test

# Mobile tests
cd mobile
npm test
```

## Deployment

See README.md for detailed deployment instructions.
