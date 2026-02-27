# Social Publishing & Moderation Platform

A multi-tenant, enterprise-ready social publishing platform built with:
- **Frontend**: Next.js 15 (App Router, TypeScript)
- **Backend**: Python FastAPI
- **Database**: Supabase (PostgreSQL + Auth + Storage + Realtime)
- **AI**: Google Gemini API (content moderation & risk scoring)

## Getting Started

### Prerequisites
- Node.js 18+
- Python 3.11+
- Supabase account

### Frontend Setup
```bash
cd frontend
cp .env.local.example .env.local
# Edit .env.local with your Supabase credentials
npm install
npm run dev
```

### Backend Setup
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
# Edit .env with your credentials
uvicorn app.main:app --reload
```

### Running
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- API Docs: http://localhost:8000/docs

## Project Structure
```
├── frontend/          # Next.js app
├── backend/           # FastAPI app
└── supabase/          # Database migrations
```

## Design System
- **Font**: Plus Jakarta Sans
- **Theme**: Instagram-inspired with dark mode
- **Colors**: Vibrant gradient palette (#F58529 → #DD2A7B → #8134AF)
