# NV SaaS Comptable - FPS Integration Skeleton

Architecture:
- Frontend: React (Vite)
- Backend: Node.js / Express
- Database: PostgreSQL schema in `database/schema.sql`
- Queue/Workers: BullMQ + Redis

## 1) Prerequisites
- Node.js 20+
- PostgreSQL 15+
- Redis 7+

## 2) Backend setup
1. Copy `.env.example` to `.env` in `backend/`.
2. Set FPS variables (`FPS_CLIENT_ID`, `FPS_REDIRECT_URI`, RS256 key, etc.).
3. Set infra variables (`DATABASE_URL`, `REDIS_URL`, `ACCOUNTANT_DEMO_ID`).
3. Install and run:

```bash
cd backend
npm install
npm run dev
```

Backend default URL: `http://localhost:4000`

Run worker in a second terminal:

```bash
cd backend
npm run worker
```

## 3) Frontend setup
1. Copy `.env.example` to `.env` in `frontend/`.
2. Install and run:

```bash
cd frontend
npm install
npm run dev
```

Frontend default URL: `http://localhost:5173`

## 4) Database setup
Execute `database/schema.sql` on PostgreSQL.

## 5) Available demo endpoints
- `POST /api/fps/connect/start` with body `{ "ecbNumber": "0123456789" }`
- `GET /api/fps/connect/callback` (FPS redirect endpoint)
- `GET /api/fps/mandants`
- `POST /api/fps/tokens/refresh` (body optional `{ "ecbNumber": "0123456789" }`)
- `GET /health`

## Important notes
- Tokens are persisted encrypted in PostgreSQL; connection flow state remains in-memory.
- Refresh processing is asynchronous via BullMQ worker.
- ID token validation is enabled (nonce, aud, exp, optional iss, and RS256 signature via FPS JWKS).
- Token lifecycle events are stored in `token_events` for audit and troubleshooting.
