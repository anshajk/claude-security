# LVT Command Center API (bootcamp)

A deliberately small **Fastify (TypeScript)** service that mirrors the LiveView Technologies
"Command Center" domain: **Orgs** (tenants) own **Sites**, which host **Units** (deployed
camera/sensor towers) that raise **Alerts** and record **Clips** (footage).

> This service is a **teaching artifact** for the Day 3 "Trust Gate" labs. It intentionally
> contains planted weaknesses used in the security lab. **Do not deploy it.** See
> `../labs/part3-security/vuln-answer-key.md` (facilitator only).

## Stack
- Fastify 5, raw `better-sqlite3` (in-memory, raw SQL on purpose), Zod schemas, token auth.
- Vitest tests via Fastify `inject`; Biome for lint/format; tsx for dev.

## Run
From the repo root: `make dev-api`, or here: `pnpm dev` (serves on `http://localhost:8000`).
Tests: `pnpm test`. Lint: `pnpm lint`. Type-check: `pnpm build`.
