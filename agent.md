# Social Publishing & Moderation Platform — Agent Context

## Project Overview

A multi-tenant, enterprise-ready social publishing platform with public posts, private communities, moderation workflows, content reporting, monetization options, analytics dashboards, compliance controls, and role-based governance.

**Suitable for:** Corporate internal communities, regulated industry discussions, enterprise brand communities, creator-driven platforms, moderated public social networks.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | Next.js 15 (App Router, TypeScript, Tailwind CSS v4, shadcn/ui) |
| **Backend** | FastAPI (Python 3.12+) |
| **Database** | Supabase (PostgreSQL 17) |
| **Auth** | Supabase Auth (JWT-based) |
| **AI** | Google Gemini API (`google-generativeai` SDK) |
| **Icons** | Lucide React |
| **Fonts** | Plus Jakarta Sans (Google Fonts) |

---

## Project Structure

```
/home/sanket/PROJECT/
├── frontend/                    # Next.js app (port 3000)
│   ├── src/
│   │   ├── app/                 # App Router pages
│   │   │   ├── (auth)/          # Login, Signup (no sidebar)
│   │   │   ├── (main)/          # Feed, Explore, Profile, etc.
│   │   │   ├── admin/           # Admin pages (analytics, reports)
│   │   │   ├── moderation/      # Moderation dashboard
│   │   │   ├── compliance/      # Compliance pages
│   │   │   ├── layout.tsx       # Root layout (server component)
│   │   │   └── page.tsx         # Home feed
│   │   ├── components/
│   │   │   ├── ui/              # shadcn/ui primitives
│   │   │   └── layout/          # Sidebar, AnimatedBackground, ClientLayoutWrapper
│   │   └── lib/                 # supabase.ts, api.ts, utils.ts, auth-context.tsx
│   └── package.json
│
├── backend/                     # FastAPI app (port 8000)
│   ├── app/
│   │   ├── main.py              # FastAPI entrypoint + CORS
│   │   ├── config.py            # Pydantic settings (.env)
│   │   ├── middleware/          # Auth middleware (JWT validation)
│   │   ├── models/              # Pydantic schemas
│   │   ├── routers/             # API route modules
│   │   ├── services/            # Business logic
│   │   ├── utils/               # supabase_client.py, ai_client.py
│   │   └── workers/             # Background jobs
│   └── requirements.txt
│
└── agent.md                     # This file
```

---

## Supabase Project

- **Project ID:** `cbilnvuvvjnwyinfuhat`
- **Region:** `ap-northeast-2`
- **URL:** `https://cbilnvuvvjnwyinfuhat.supabase.co`
- **Anon Key:** Set in `.env.local` (frontend) and `.env` (backend)

---

## Architecture Flow

```
Frontend (Next.js) ──signIn/signUp──> Supabase Auth ──JWT──> Frontend
Frontend ──Bearer token──> FastAPI Backend ──validates JWT──> Business Logic ──> Supabase DB
```

- **Supabase Auth** handles login/signup directly from the frontend (passwords never touch FastAPI)
- **FastAPI** validates the Supabase JWT on every API request and enforces RBAC
- **Next.js** calls Supabase for auth, FastAPI for all data operations

---

## User Roles (7 roles)

| Role | Responsibilities |
|------|-----------------|
| `user` | Publish, comment, interact |
| `verified_creator` | Monetize & analytics access |
| `community_moderator` | Review flagged content in their community |
| `senior_moderator` | Escalation handling across communities |
| `admin` | Full governance, bans, system settings |
| `compliance_officer` | Audit access, data export |
| `analyst` | Platform-wide analytics |

---

## Route Access Control

| Route | Required Roles |
|-------|---------------|
| `/login`, `/signup` | Public (redirect if logged in) |
| `/`, `/explore`, `/create`, etc. | Any authenticated user |
| `/moderation` | `community_moderator`, `senior_moderator`, `admin` |
| `/admin`, `/admin/*` | `admin` only |
| `/compliance` | `compliance_officer`, `admin` |
| `/admin/analytics` | `admin`, `analyst` |

---

## Database Schema (Supabase)

### `public.profiles`
Extends `auth.users`. Auto-created via trigger on signup.

| Column | Type | Notes |
|--------|------|-------|
| `id` | UUID PK | FK → `auth.users(id)` |
| `username` | TEXT UNIQUE | Required |
| `display_name` | TEXT | Optional |
| `bio` | TEXT | Optional |
| `avatar_url` | TEXT | Optional |
| `role` | TEXT | Default `'user'`, check constraint for 7 roles |
| `account_status` | TEXT | Default `'active'` |
| `is_verified` | BOOLEAN | Default `false` |
| `mfa_enabled` | BOOLEAN | Default `false` |
| `created_at` | TIMESTAMPTZ | Default `NOW()` |
| `updated_at` | TIMESTAMPTZ | Default `NOW()` |

### `public.permissions`
Role-resource-action permission matrix.

| Column | Type | Notes |
|--------|------|-------|
| `id` | UUID PK | Auto-generated |
| `role` | TEXT | Role name |
| `resource` | TEXT | e.g. `posts`, `moderation`, `admin` |
| `action` | TEXT | e.g. `create`, `read`, `update`, `delete` |

---

## Core Modules (Implementation Phases)

1. ✅ **Project Scaffolding** — Next.js + FastAPI + Supabase + 13 page stubs
2. 🔄 **Authentication & RBAC** — Supabase Auth + JWT middleware + profiles
3. ⬜ **Content Publishing Engine** — Posts (text/image/video/poll/thread), lifecycle
4. ⬜ **Engagement System** — Likes, comments, reposts, bookmarks, shares
5. ⬜ **Communities** — CRUD, membership, roles, moderation policies
6. ⬜ **Moderation Workflow** — Reports, AI risk scoring, decision lifecycle
7. ⬜ **Search & Discovery** — Full-text search, trending, suggestions
8. ⬜ **Notifications** — In-app + Supabase Realtime
9. ⬜ **Analytics & Reporting** — Creator + admin dashboards, export
10. ⬜ **Compliance & Data Governance** — Data export, audit logs
11. ⬜ **Admin & Governance** — User management, rule config, system settings
12. ⬜ **Background Jobs** — Scheduled tasks, SLA monitoring

---

## API Endpoints (Backend)

### Auth
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/auth/me` | GET | Get current user profile |
| `/api/auth/me` | PUT | Update own profile |
| `/api/auth/me/role` | GET | Get role + permissions |

### Admin
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/admin/users` | GET | List all users |
| `/api/admin/users/{id}/role` | PUT | Change user role |
| `/api/admin/users/{id}/suspend` | POST | Suspend user |
| `/api/admin/users/{id}/reinstate` | POST | Reinstate user |

### Posts (Phase 3)
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/posts` | POST | Create post |
| `/api/posts` | GET | List posts (feed) |
| `/api/posts/{id}` | GET/PUT/DELETE | CRUD |
| `/api/posts/feed` | GET | Personalized feed |
| `/api/posts/trending` | GET | Trending posts |

---

## Design System

- **Theme:** Instagram-inspired with glassmorphism
- **Colors:** Vivid purple primary, Instagram gradient for branding
- **Dark mode:** Default, with light mode toggle
- **Layout:** Sidebar (left) + main content (centered, 640px for regular pages, full-width for management)
- **Background:** Animated gradient blobs behind glassmorphic content cards
- **Management screens** (moderation, admin, compliance): Full-width layout
- **Regular screens** (home, explore, profile): 640px max-width centered

---

## Environment Variables

### Frontend (`frontend/.env.local`)
```
NEXT_PUBLIC_SUPABASE_URL=https://cbilnvuvvjnwyinfuhat.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon_key>
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### Backend (`backend/.env`)
```
SUPABASE_URL=https://cbilnvuvvjnwyinfuhat.supabase.co
SUPABASE_ANON_KEY=<anon_key>
SUPABASE_SERVICE_ROLE_KEY=<service_role_key>
GEMINI_API_KEY=<gemini_key>
JWT_SECRET=<supabase_jwt_secret>
CORS_ORIGINS=["http://localhost:3000"]
```

---

## Performance Requirements

- Feed load < 300ms
- Post publish < 200ms
- Moderation decision < 200ms
- Support 100k concurrent users
- Real-time notifications < 1s
