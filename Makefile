# Day 3 "Trust Gate" bootcamp — one-command lab operations.
# Tooling: pnpm + Biome + Vitest (TypeScript everywhere). No Bazel.
.DEFAULT_GOAL := help

API_FILTER := command-center-api
WEB_FILTER := command-center-dashboard

.PHONY: help setup build test lint dev dev-api dev-web slop reset clean

help: ## Show this help
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) \
		| sort | awk 'BEGIN{FS=":.*?## "}{printf "  \033[36m%-12s\033[0m %s\n", $$1, $$2}'

setup: ## Install all workspace dependencies (backend + frontend)
	pnpm install

build: ## Type-check both packages
	pnpm -r build

test: ## Run backend + frontend test suites (vitest)
	pnpm -r test

lint: ## Lint + format-check both packages (biome)
	pnpm lint

dev: ## Reminder for the two dev servers
	@echo "Run 'make dev-api' and 'make dev-web' in two terminals."

dev-api: ## Start the Fastify Command Center API on :8000
	pnpm --filter $(API_FILTER) dev

dev-web: ## Start the Vite dashboard on :5173
	pnpm --filter $(WEB_FILTER) dev

slop: ## Create the slop/part-1 branch with the planted Part 1 defects
	bash scripts/make-slop-branch.sh

reset: ## Return the repo to the clean baseline (discard lab branches/changes)
	bash scripts/reset.sh

clean: ## Remove build artifacts and caches
	rm -rf frontend/dist frontend/node_modules/.vite
