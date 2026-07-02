# Part 1 Lab — Anti-Slop Review

**Goal:** Find AI draft defects with a checklist and a self-verify gate.

## The scenario
AI wrote an "acknowledge alerts + operator notes" feature.
The diff looks fine at first.
It has 8 planted quality defects. None are security bugs. Security bugs are Part 3.

## Setup
```bash
make slop          # creates branch slop/part-1 with the AI draft applied
git diff main...slop/part-1
```
If `make slop` says the tree is dirty, run `make reset` first.

## What you do
1. Review the diff against `checklist.md`.
   Score one point for each defect you find and can explain.
   Work solo first. Then compare with a partner.
2. From the repo root, run:
   ```
   /self-verify
   ```
   See which defects the automated layer catches for free.
   This layer uses build, tests, and lint. See `.claude/skills/self-verify/SKILL.md`.
   Mark which defects still need human judgment.
3. At the debrief, the facilitator reveals `answer-key.md`.

## What you'll learn
A checklist beats a careful read.
Deterministic gates, like tests and lint, free up human judgment.

## Files
- `checklist.md`
- `answer-key.md` (facilitator only)
- `slop.patch`
