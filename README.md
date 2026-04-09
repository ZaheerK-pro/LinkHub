# LinkHub

LinkHub is a multi-tenant link-in-bio platform where each user gets:
- a private dashboard to manage links
- a themed public profile page (`/profile/:username`)
- click analytics to track link performance

## Product Overview

LinkHub helps creators, freelancers, and teams centralize all important links in one profile and measure engagement.

### Core capabilities
- **Authentication**: signup/login with JWT
- **Multi-tenancy**: each account is isolated by tenant
- **Link management**: create, edit, delete, and reorder links
- **Public profile**: share a branded profile page by username
- **Theming**: preset and custom style variables
- **Analytics**: total clicks, top links, and trend chart

## Tech Stack

- **Frontend**: React, Vite, TypeScript, Tailwind, React Query, DnD Kit, Recharts
- **Backend**: Fastify, TypeScript, TypeORM, Inversify, Zod, JWT, bcrypt
- **Database**: PostgreSQL

## Project Structure

```txt
LINKHUB/
  backend/
    src/
      controllers/      # Fastify endpoint registration + handlers
      usecases/         # Business logic
      repositories/     # Data access layer
      schemas/          # Request/response input schemas
      entities/         # TypeORM entities
      plugins/          # Auth guard, shared Fastify plugins
      inversify/        # DI container and symbols
      migrations/       # DB migrations
      app.ts            # Fastify app builder
      data-source.ts    # TypeORM datasource
      index.ts          # Server bootstrap
  frontend/
    src/
      pages/            # Route pages
      components/       # Reusable UI
      hooks/            # React Query hooks
      services/         # API service layer
      state/            # Auth state/context
      lib/              # API client and helpers
      main.tsx          # React app entry
      App.tsx           # Route config
```

## Prerequisites

- Node.js 18+ (recommended)
- npm 9+
- PostgreSQL database

## Environment Variables

### Backend (`backend/.env`)

```env
PORT=4000
FRONTEND_URL=http://localhost:5173
JWT_SECRET=your_secret_here
DATABASE_URL=postgresql://user:password@host:5432/dbname
```

### Frontend (`frontend/.env`)

```env
VITE_API_URL=http://localhost:4000
```

## Local Development Setup

### 1) Clone and install dependencies

```bash
git clone <your-repo-url>
cd LINKHUB
cd backend && npm install
cd ../frontend && npm install
```

### 2) Configure environment files

- Create `backend/.env` with backend variables
- Create `frontend/.env` with `VITE_API_URL`

### 3) Run database migration

```bash
cd backend
npm run migration:run
```

### 4) Start backend

```bash
cd backend
npm run dev
```

Backend runs on `http://localhost:4000`.

### 5) Start frontend

```bash
cd frontend
npm run dev
```

Frontend runs on `http://localhost:5173`.

## Useful Scripts

### Backend
- `npm run dev` - start dev server with auto-reload
- `npm run build` - compile TypeScript
- `npm run start` - run compiled build
- `npm run lint` - run ESLint
- `npm run migration:run` - apply migrations

### Frontend
- `npm run dev` - start Vite dev server
- `npm run build` - create production build
- `npm run preview` - preview production build

## API Endpoints (Main)

### Auth
- `POST /auth/signup`
- `POST /auth/login`
- `GET /auth/me`

### Links
- `GET /links`
- `POST /links`
- `PUT /links/:id`
- `DELETE /links/:id`
- `PUT /links/reorder/all`

### Theme
- `GET /theme`
- `PUT /theme`

### Analytics
- `GET /analytics?linkId=<optional-link-id>`

### Public
- `GET /profile/:username`
- `POST /click/:linkId`

## Production Notes

- Keep `JWT_SECRET` strong and private
- Use managed PostgreSQL and secure `DATABASE_URL`
- Configure CORS `FRONTEND_URL` to your real frontend domain
- Deploy frontend and backend as separate services

## Security Notes

- JWT includes `userId`, `tenantId`, and `username`
- Protected endpoints use auth guard middleware
- Tenant-based filtering prevents cross-tenant data access

