#!/usr/bin/env bash
# Part 1 lab: create the slop/part-1 branch carrying the planted defects.
#
# The bootcamp ships as plain files (not necessarily a git repo). This script makes the lab work
# regardless: it initialises git if needed, snapshots a clean baseline, then applies slop.patch on
# a dedicated branch so engineers can review the diff with `git diff main...slop/part-1`.
set -euo pipefail
cd "$(dirname "$0")/.."

PATCH="labs/part1-anti-slop/slop.patch"
BRANCH="slop/part-1"

[ -f "$PATCH" ] || { echo "Missing $PATCH"; exit 1; }

if [ ! -d .git ]; then
  echo "==> Initialising git repo (baseline = 'main')"
  git init -q
  git checkout -q -b main 2>/dev/null || git branch -q -M main
  git add -A
  git -c user.email=bootcamp@example.com -c user.name=Bootcamp commit -q -m "baseline: clean Command Center"
fi

# Refuse to run on a dirty tree so the diff stays clean.
if ! git diff --quiet || ! git diff --cached --quiet; then
  echo "Working tree is dirty. Commit or run 'make reset' first."; exit 1
fi

git branch -q -D "$BRANCH" 2>/dev/null || true
git checkout -q -b "$BRANCH"

echo "==> Applying $PATCH"
git apply --index "$PATCH"
git -c user.email=bootcamp@example.com -c user.name=Bootcamp commit -q -m "feat: alert acknowledgement + operator notes (AI draft)"

echo "==> Done. Review the planted PR with:"
echo "    git diff main...$BRANCH"
echo "    (answer key: labs/part1-anti-slop/answer-key.md)"
