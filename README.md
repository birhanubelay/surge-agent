# 🏪 SurgeAgent
AI-powered match-day surge optimizer for micro-businesses.

## 🛠️ Tech Stack
- **Frontend**: Vite + React + TypeScript + Tailwind + shadcn/ui
- **Backend**: Express + TypeScript
- **Database**: Neon PostgreSQL + Prisma ORM
- **AI/Integration**: Google Cloud Agent Builder (Gemini 3) + Fivetran MCP

## 🚀 Quick Start
1. `npm install` (root)
2. Copy `.env.example` → `.env` & fill credentials
3. `npm run db:push` (migrate Neon DB)
4. `npm run dev` (starts frontend + backend)

## 📐 Architecture
- `db/` → Prisma schema & migrations
- `server/` → Express API, services, routes
- `frontend/` → React UI, components, hooks
- `docs/` → Architecture diagrams & setup guides

## 🤝 Workflow
- `main` → Production-ready
- `develop` → Integration branch
- `feature/*` → Branch from `develop`, PR back to `develop`
- All PRs require review before merge.
