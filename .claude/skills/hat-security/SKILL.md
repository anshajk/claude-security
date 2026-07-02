---
name: hat-security
description: Security hat — review this diff ONLY through a security lens. One vantage, deep, no other concerns.
argument-hint: "[diff range or files, e.g. main...slop/part-1]"
disable-model-invocation: true
allowed-tools: Read, Grep, Glob, Bash(git diff:*), Bash(git log:*)
---

# /hat-security $ARGUMENTS

You wear exactly **one hat: security.** Ignore design, style, performance, and DRY — other reviewers
own those. Your job is to find ways this change can be abused. Reason from the attacker's side.

Review scope: **$ARGUMENTS** (default to the current diff if empty).

Check, with file:line evidence:
- **Injection** (SQL/command/template) — any query or shell built from request data.
- **Broken access control / IDOR** — does every resource load scope to the caller's tenant/owner?
  Compare sibling handlers; the bug is usually an inconsistency.
- **SSRF** — server-side fetch of a client-supplied URL without an allowlist.
- **XSS** — untrusted data reaching an HTML sink (`dangerouslySetInnerHTML`, `innerHTML`).
- **Secrets/config** — hard-coded credentials, permissive CORS, leaked internal URLs.
- **AuthN/AuthZ on state-changing or physical-effect actions.**

Output: ranked findings (high→low) with class, `file:line`, concrete exploit, and minimal fix. End
with the single most dangerous issue named first. If you find nothing, say so plainly — do not invent
issues to fill the hat.

<!-- VERIFY: `$ARGUMENTS`, `argument-hint`, `disable-model-invocation`, and `allowed-tools` Bash(...)
     scoping against your installed Claude Code version. Run as a separate session/context from the
     other hats. -->
