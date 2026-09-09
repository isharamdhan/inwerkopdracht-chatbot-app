# ChatBot App — Onboarding Assignment

Starter setup for the onboarding assignment: a chat app built with **Next.js
(App Router) + TypeScript + tRPC + MySQL + Tailwind + OpenAI**, fully runnable
via Docker.

This repo contains **only the working base wiring** — enough to prove the whole
stack runs. The actual assignment (chat UI, sessions, system prompt, OpenAI
integration) is yours to build.

## Quick start

```bash
cp .env.example .env
docker compose up --build
```

Then open http://localhost:3000. You'll see a status page that calls the server
over tRPC and checks whether the database is reachable. All green = it works.

Stop with `Ctrl+C`, or `docker compose down` (add `-v` to also wipe the database).

Dependencies are installed by the container (on `up`) straight into `./node_modules`
in the project folder, so your IDE sees the types too. You don't run `npm install`
on your host yourself — note that `node_modules` ends up owned by root because the
container created it.

## What's included

| Path                  | What                                                                  |
| --------------------- | --------------------------------------------------------------------- |
| `docker-compose.yml`  | Starts the Next.js app + MySQL with one command                       |
| `Dockerfile`          | Dev image running `next dev` (hot reload)                             |
| `init.sql`            | Placeholder only — **no schema here**; use migrations instead         |
| `migrations/`         | **The schema and all changes live here** (see `migrations/README.md`) |
| `scripts/migrate.mjs` | Applies pending migrations, tracked in `schema_migrations`           |
| `src/server/db.ts`    | mysql2 connection pool                                                |
| `src/server/api/`     | tRPC server: `trpc.ts`, `root.ts`, `routers/health.ts`                |
| `src/trpc/`           | tRPC client + React Query provider                                    |
| `src/app/`            | Layout + status page + tRPC route handler                             |

## What you'll build

1. **Schema** — create `migrations/0001_init.sql` with the `sessions`, `messages`, `system_prompts` tables.
2. **Routers** — add tRPC routers in `src/server/api/routers/` and register them in `src/server/api/root.ts`.
3. **UI** — build the chat interface, session list and system-prompt sidebar in `src/app/`, with loading states.
4. **OpenAI** — add a `sendMessage` endpoint that sends the system prompt + recent messages and stores the reply.

## Database schema & migrations

Migrations are the single source of truth for the schema. `init.sql` stays empty
on purpose — don't put tables there.

Add numbered `.sql` files in `migrations/`, starting with `0001_init.sql` for the
base tables and one file per change after that. They run automatically on app
start and are tracked in `schema_migrations`, so each runs exactly once. See
`migrations/README.md`.

Run migrations manually inside the running container:

```bash
docker compose exec app npm run db:migrate
```

## Docker tips

- **Added a dependency** (`package.json` changed)? Just restart: `docker compose up`.
  The `command` runs `npm install` on every start, so new packages are picked up —
  no `--build` needed.
- **Need a fresh database?** Reset with `docker compose down -v && docker compose up`
  (migrations re-run from scratch on the empty volume).

## About "MySQL Alpine"

There is **no official `mysql:*-alpine` image** anymore (those tags were removed
by Oracle). This setup uses the official `mysql:8.4`. If you specifically want a
lightweight Alpine-based variant, MariaDB is the alternative — `mysql2` works with
it too.
