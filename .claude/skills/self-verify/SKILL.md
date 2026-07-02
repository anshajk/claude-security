---
name: self-verify
description: Self-verifying loop — build, test, and lint before presenting any diff, then self-critique.
disable-model-invocation: true
allowed-tools: Bash(make:*), Bash(pnpm:*), Bash(git diff:*), Read, Grep
---

# /self-verify

You are about to present a code change. **Do not** present it until it has passed the deterministic
gates below. Treat your own first draft as untrusted.

## Step 1 — Run the deterministic gates
Run each and capture the result. If a tool is missing, say so explicitly; do not skip silently.

1. **Lint / type-check**
   - Backend: `pnpm --filter command-center-api lint`
   - Frontend: `pnpm --filter command-center-dashboard lint`
2. **Tests**
   - Backend: `pnpm --filter command-center-api test`
   - Frontend: `pnpm --filter command-center-dashboard test`
3. **Build**
   - Both: `pnpm -r build`

(Equivalent shortcut: `make lint && make test && make build`.)

## Step 2 — If anything is red
Fix the cause, then re-run from Step 1. Never present a diff with a failing gate. If a test is green
but **asserts nothing meaningful**, treat that as red: strengthen the assertion and re-run.

## Step 3 — Structured self-critique (after gates are green)
Re-read your own diff (`git diff`) and answer, briefly and honestly:
- **Logic:** re-derive each helper from its name/intent. Any inverted comparison, off-by-one, or
  wrong default?
- **Drift:** is any block copied and not fully adapted (status strings, routes, field names, logs)?
- **Error handling:** any swallowed errors or ignored return values?
- **Tests:** does each new test assert the behavior it names, on the value that matters?
- **Scope:** anything changed that the task did not ask for?

## Step 4 — Present
Show: (a) the gate results, (b) your self-critique findings, (c) the diff. Flag anything you are
unsure about rather than smoothing it over.

<!-- VERIFY: skill frontmatter keys (`name`, `description`, `disable-model-invocation`, `allowed-tools`)
     and the `.claude/skills/<name>/SKILL.md` location against your installed Claude Code version. The
     `allowed-tools` Bash(...) pattern syntax is the most drift-prone part. `disable-model-invocation`
     keeps this a manual `/self-verify` ritual rather than something Claude auto-triggers. -->
