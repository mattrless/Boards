# Boards Frontend

Next.js app for the Boards Backend. Uses React Query, Socket.IO, and an Orval-generated API client that targets the backend Swagger.

## Stack

- Next.js 16 + React 19
- Tailwind CSS 4
- React Query
- Socket.IO client
- Orval (OpenAPI client generation)
- shadcn/ui components

## Structure

- `src/app`: App Router pages (auth, boards, admin)
- `src/components`: UI and feature components
- `src/hooks`: React Query + socket hooks
- `src/lib/api/generated`: Orval-generated API clients
- `src/lib/api/custom-fetch.ts`: Custom API fetch wrapper

## Commands

- Install: `pnpm -C frontend install`
- Dev server: `pnpm -C frontend dev`
- Build: `pnpm -C frontend build`
- Generate API client (Orval): `pnpm -C frontend api:generate`

## Orval

- Config: `frontend/orval.config.ts`
- Output: `frontend/src/lib/api/generated`
- OpenAPI source: `ORVAL_OPENAPI_URL` (defaults to backend Swagger JSON)

## Notes

- API routes under `src/app/api/nest/[...path]/route.ts` proxy to the backend.
- WebSocket events are consumed via Socket.IO hooks in `src/hooks`.
