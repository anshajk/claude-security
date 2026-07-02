# Part 4 Lab — Permissions Without Constant Interruptions

**Goal:** turn permissions from a personal setting into a **committed team standard** everyone
inherits — and build the habit of *testing* a rule instead of trusting its name.

Claude Code checks your rules before it runs a command, reads a file, or fetches a URL. The rules
live in three lists in `.claude/settings.json`:

- **allow** — safe, frequent, easy to undo. Runs without asking. (reads, tests, lint, `make`,
  `curl localhost`)
- **ask** — powerful or reaches the outside world. Prompts you every time. (`git push`,
  `WebFetch`, edits to `.claude/`)
- **deny** — never allowed. (`.env` reads, the cloud-metadata IP, `rm -rf`, force-push)

Claude Code checks them **in that order — deny, then ask, then allow — and the first match wins.**
How specific a rule is doesn't matter; the order does. A broad `deny` always beats a narrow
`allow`.

> Rules are enforced by Claude Code, not the AI. Writing "don't do X" in a prompt or `CLAUDE.md`
> is a *request*, not a fence. Only `settings.json` rules and hooks actually stop an action.

---

## What you do

### 1. Read your rules
- Run `/permissions` to see every active rule and where it comes from.
- Walk `.claude/settings.json`. For each rule ask: **allow, ask, or deny — and why?**
- Run `claude doctor` to check the file is valid.

### 2. Break a rule
- Open `fragile-rules.md`. It has three rules that *look* safe.
- For each one, find a command it **fails to stop**, then rewrite it so it holds.
- Lesson: a permission rule is a claim. Test it before you trust it.

### 3. Layer a gate
- Follow `layered-gate.md`. Protect `.env` with a `deny` rule, then watch a small script slip
  right past it, then add a hook.
- Discuss what an OS sandbox would add that a rule and a hook can't.
- Lesson: defense in depth — no single gate is enough.

### 4. Decide & commit
- Open `contested-rule.md`. Debate the planted rule: auto-allow `git push` to feature branches?
- Record the **decision and the dissent** — both are the deliverable.
- Commit the agreed `settings.json` so the whole team inherits it. `.claude/settings.local.json`
  stays gitignored for personal-only conveniences (see `settings.local.json.example`).

**Stretch:** open `managed-policy.example.json` — the version IT would push so nobody can turn
the deny list off or switch on "skip all prompts." It's also how you contain a risky skill or MCP
server. Then skim `pr-gate-recipe.md`: settings + hook + CODEOWNERS + CI = the full gate.

---

## The physical-action rule

A real Command Center never auto-fires a `deterrent` (lights, strobe, audio on a Unit in the
field). Same for the agent: **never auto-allow anything irreversible or with a real-world
effect.**

## What you'll learn

- Permissions are a committed team standard, not a personal preference.
- A rule is only as good as the test you ran against it.
- Real protection is layered: rule → hook → sandbox.
- The reasoning and the dissent are the deliverable — not consensus.

## Files

- `fragile-rules.md` — three rules that look safe (Activity 2)
- `layered-gate.md` — protect `.env` in three layers (Activity 3)
- `contested-rule.md` — the debate + decision record (Activity 4)
- `managed-policy.example.json` — the fleet-wide policy IT would push (stretch)
- `pr-gate-recipe.md` — how all the gates compose into one merge standard
- `../../.claude/settings.json`
- `../../.github/CODEOWNERS`
- `../../.github/workflows/ci.yml`
