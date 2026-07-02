#!/usr/bin/env bash
# Return the repo to the clean baseline between cohorts/runs.
set -euo pipefail
cd "$(dirname "$0")/.."

if [ -d .git ]; then
  echo "==> Resetting to clean 'main' baseline"
  # Discard any uncommitted lab edits on the CURRENT branch first, so a dirty
  # working tree can't block the checkout below. (Part 1 agents routinely modify
  # files, so the tree is usually dirty at reset time.)
  git reset -q --hard
  # Switch to main, creating it only if it genuinely doesn't exist. Checking the
  # ref explicitly avoids the old "checkout failed => create main" fallback, which
  # mis-reported a dirty tree as 'a branch named main already exists'.
  if git show-ref --verify --quiet refs/heads/main; then
    git checkout -q main
  else
    git checkout -q -b main
  fi
  git reset -q --hard
  git clean -qfd -e node_modules -e .venv -e frontend/node_modules
  git branch -q -D slop/part-1 2>/dev/null || true
  echo "==> Baseline restored."
else
  echo "No git repo present; nothing to reset. (Slop branch is only created by make slop.)"
fi
