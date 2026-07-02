# Trust Gate Bootcamp — LVT Command Center (Day 3)

A small, runnable **Command Center** mini-platform used for the Day 3 "Trust Gate" labs. It mirrors
the LiveView Technologies domain: solar/cellular surveillance **Units** managed through a cloud VMS,
with **Alerts**, archived **Clips**, remote **deterrent** controls, and multi-tenant **Orgs**.

It is deliberately built to look tidy and idiomatic while hiding planted defects and vulnerabilities,
so engineers can practice reviewing, securing, and gating AI-written code.

> This repo contains **intentional** bugs and vulnerabilities for the labs. Do not copy any pattern
> from it into production.

## Stack
- **Backend** — Fastify (TypeScript, Node), raw `better-sqlite3`, token auth, multi-tenant org scoping.
- **Frontend** — React + Vite + TypeScript dashboard.
- **Tooling** — pnpm workspace, Biome (lint/format), Vitest (tests), **make** targets. No Bazel.

## Prerequisites
- Node 20+ and [`pnpm`](https://pnpm.io/) (`corepack enable` then `corepack prepare pnpm@9.15.0 --activate`)

## Quickstart
```bash
make setup          # pnpm install (backend + frontend)
make test           # backend + frontend vitest (all green on the baseline)
make dev-api        # terminal 1 -> http://localhost:8000  (/health)
make dev-web        # terminal 2 -> http://localhost:5173
```

Seed credentials (send as `Authorization: Bearer <token>`):

| Token                   | Org           | Role     |
| ----------------------- | ------------- | -------- |
| `acme-operator-token`   | Acme DOT      | operator |
| `acme-admin-token`      | Acme DOT      | admin    |
| `globex-operator-token` | Globex Energy | operator |

Two orgs exist on purpose so cross-tenant (IDOR) bugs are demonstrable.

## Lab map
| Part | Topic | Folder | Key repo touchpoints |
| ---- | ----- | ------ | -------------------- |
| 1 | Anti-slop & self-verify | `labs/part1-anti-slop/` | `scripts/make-slop-branch.sh`, `slop.patch`, `.claude/skills/self-verify/SKILL.md` |
| 2 | Multi-hat adversarial review | `labs/part2-multi-hat/` | `contracts/openapi.yaml`, `.claude/skills/hat-*/SKILL.md` |
| 3 | Security / OWASP | `labs/part3-security/` | `backend/src/api/*`, `.claude/skills/owasp-review/`, `.claude/agents/security-reviewer.md` |
| 4 | Permissions & enforcement | `labs/part4-permissions/` | `.claude/settings.json`, `.github/workflows/ci.yml`, `.github/CODEOWNERS` |

## Make targets
Run `make help` for the full list (`setup`, `build`, `test`, `lint`, `dev-api`, `dev-web`, `slop`, `reset`, `clean`).
