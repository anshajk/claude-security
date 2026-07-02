---
name: triage
description: Triage a single security finding end to end — confirm real vs. false positive, then remediate or dismiss with a written record.
argument-hint: "<finding id or short description>"
disable-model-invocation: true
allowed-tools: Read, Grep, Glob, Edit, Bash(pnpm:*), Bash(git diff:*)
---

# /triage $ARGUMENTS

Take the finding "**$ARGUMENTS**" and triage it to a decision. The goal is an honest, written verdict
the team can stand behind — not a closed ticket.

## Steps
1. **Locate** the exact code (`file:line`) the finding refers to. Quote it.
2. **Reproduce the reasoning.** Is the dangerous input actually reachable from an untrusted caller?
   Trace input → sink. For access-control findings, check whether a tenant/owner predicate exists.
3. **Verdict:** `real` or `false-positive`.
   - If **real**: state severity and the concrete exploit, then propose the minimal fix. If asked to
     fix, make the change and re-run the relevant tests (`pnpm --filter command-center-api test` / `pnpm ... test`).
   - If **false-positive**: explain *why* it is safe (e.g., allowlist-guarded interpolation), and what
     evidence proves it. Do not just assert it.
4. **Record** the decision using `labs/part3-security/triage-record-template.md`. Both a fix and a
   dismissal must be written down with the reasoning.

## Reminder
A false positive dismissed without written justification is indistinguishable from a real bug ignored.
Write the reason every time.

<!-- VERIFY: `$ARGUMENTS` substitution, `argument-hint`, `disable-model-invocation`, and `allowed-tools`
     Bash(...) scoping against your installed Claude Code version. -->
