# Part 3 Lab — Security: Secure-by-Default & OWASP

**Goal:** Shift security left — install a project-scoped OWASP skill, run an independent security pass, and build the triage muscle to keep tooling honest.

## The planted surface

Use the baseline API on `main`. Do not use a slop branch.

It ships five real security issues plus one decoy.

Three buckets:
- **CAUGHT:** SQL injection.
- **FALSE POSITIVE:** allowlisted ORDER BY. This is safe.
- **CAUGHT BUT UNPROVEN:** clips multi-tenant IDOR. This is the dangerous one.

The owasp-review skill does flag the clips IDOR. But a catch is a claim, not a proof. The AI's own tests never check cross-tenant access, so nothing structural proves the catch.

SSRF and stored XSS round out the review.

Full map: `vuln-answer-key.md` is for the facilitator only.

## What you do

1. **Activity A — Read the OWASP skill.**
   - Read `.claude/skills/owasp-review/SKILL.md`.
   - Ask Claude for a security pass over `backend/src/api/` and the alert-notes rendering in the frontend.
   - Record what it flags.
   - Do not accept the flags yet.

2. **Activity B — Run an independent security pass.**
   - Read `.claude/agents/security-reviewer.md`.
   - Run the security-reviewer subagent.
   - Ask it to check every resource handler for multi-tenant scoping.
   - Treat it as a second independent witness to the clips IDOR.
   - Note the real gap it names: no cross-tenant test exists.

3. **Activity C — Triage one finding end to end.**
   - Pick one finding.
   - Use `/triage clips IDOR` or `/triage units sort ORDER BY false positive`.
   - Trace input to sink.
   - Prove it with two different org tokens against the running API.
   - Record the decision in `triage-record-template.md`.
   - Write down both outcomes: a fix and a dismissal both need a record.

4. **Activity D — Watch the secret-scan hook demo.**
   - The facilitator shows the `.claude/hooks/secret-scan.sh` PreToolUse hook and its entry in `.claude/settings.json`.
   - Run it once. "Add a constant to backend/src/config.ts:  const AWS_KEY = "AKIAIOSFODNN7EXAMPLE";"
   - Watch it deny an attempt to hard-code a fake AWS key.
   - Do not wire the hook yourself.
   - Discuss deterministic gates, like hooks, versus judgment gates, like review.

## Marketplace note

Skills and plugins run with the agent's privileges. Prefer reputable sources. Read the skill before installing it. Pin versions. This bootcamp ships its own vetted skill.

## What you'll learn

A tool flag is a claim, not a proof. Independence, a human-authored cross-tenant test, and a written verdict make a catch stick.

Triage keeps the tooling honest when it cries wolf.

## Files

- `vuln-answer-key.md` — facilitator only
- `triage-record-template.md`
