# Backend

NestJS backend for the Boards app. REST API, real-time Socket.IO events, and AI endpoints. Uses Prisma with PostgreSQL and JWT-based auth with role/permission checks.

## Stack

- NestJS 11
- Prisma 7 + PostgreSQL
- JWT auth (`passport-jwt`)
- Socket.IO WebSocket gateway
- Swagger + AsyncAPI docs
- Gemini AI integration (`@google/genai`)

## Modules

- `AuthModule`: login, JWT strategy, permission guards.
- `UsersModule`: user/profile CRUD and admin actions.
- `BoardsModule`: boards, members, roles, permissions.
- `ListsModule`: list CRUD and ordering.
- `CardsModule`: card CRUD, assignments, and ordering.
- `WebsocketModule`: realtime events for boards/lists/cards.
- `AiModule`: description generation and grammar checks.
- `PrismaModule`: DB access and client config.

## API Docs

- REST Swagger UI: `http://localhost:3000/rest-docs`
- Swagger JSON: `http://localhost:3000/swagger/json`
- AsyncAPI (WebSocket): `http://localhost:3000/ws-docs`

## Commands

From repo root:

- Install: `pnpm -C backend install`
- Dev server: `pnpm -C backend start:dev`
- Build: `pnpm -C backend build`
- Prod: `pnpm -C backend start:prod`

## Prisma

- Schema: `backend/prisma/schema.prisma`
- Migrations: `backend/prisma/migrations`
- Seed: `pnpm -C backend prisma db seed`

## Notes

- Check .env.example for env variables.
- REST endpoints use JWT Bearer auth.
- WebSocket auth accepts `Authorization: Bearer <token>` or `token` cookie.
