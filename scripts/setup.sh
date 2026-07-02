#!/usr/bin/env bash
# One-time environment setup for the Trust Gate bootcamp.
set -euo pipefail
cd "$(dirname "$0")/.."

echo "==> Checking tools"
command -v pnpm >/dev/null || { echo "pnpm not found. Run: corepack enable && corepack prepare pnpm@9.15.0 --activate"; exit 1; }
command -v node >/dev/null || { echo "node not found. Install Node 20+"; exit 1; }

echo "==> Install deps (pnpm install)"
pnpm install

echo "==> Sanity: backend tests"
pnpm --filter command-center-api test

echo "==> Sanity: frontend build"
pnpm --filter command-center-dashboard build

echo "==> Ready. Start the app with: make dev-api  (terminal 1)  and  make dev-web  (terminal 2)"
