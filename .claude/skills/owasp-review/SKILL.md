---
name: owasp-review
description: >
  Reviews application code for OWASP Top 10 style vulnerabilities (injection, broken access control /
  IDOR, SSRF, XSS, secrets, insecure deserialization, security misconfiguration). Use when reviewing a
  diff, an endpoint, or a file for security issues, or whenever the user asks for a security pass,
  OWASP check, or "is this safe to ship?".
---

# OWASP Review Skill

You are performing a focused security review. Be specific and evidence-based: cite the file and line,
name the vulnerability class, show the exploit shape, and give a concrete fix. **Do not** comment on
style. **Do not** invent issues to look thorough — a false alarm costs the team trust.

## Method
For each changed file (or the file under review), check the categories below in order. For every
finding, output the structured block in "Output format". If a category is clean, say so briefly.

### 1. Injection (SQL / command / template)
- Any query built with string concatenation or template literals that includes request data is **SQL
  injection** — even with `LIKE`/`%` wrapping. Flag it. The fix is parameterized queries / bound
  params.
- **Important — avoid false positives:** interpolating a value that is provably constrained to a
  fixed allowlist (e.g., an `ORDER BY` column checked against a hard-coded `set`) is *not* injectable.
  Verify the guard exists and is airtight before flagging. If interpolation is allowlist-guarded, call
  it out as **reviewed-safe**, not a vulnerability.

### 2. Broken access control / IDOR (highest-value, easiest to miss)
- For every handler that loads a resource by id, ask: **is the lookup scoped to the caller's tenant /
  owner?** A query like `SELECT * FROM <table> WHERE id = ?` with no `org_id`/`owner_id` predicate,
  in a multi-tenant app, is an **IDOR**: any authenticated user can read another tenant's data.
- Compare sibling handlers. If `units` and `alerts` scope by `org_id` but `clips` does not, the
  inconsistency is the bug. **Authorization must be uniform across every resource.**
- State-changing and physical-effect actions need a role check, not just authentication.

### 3. SSRF
- Any server-side fetch (`fetch`, `undici`, `axios`, `node:http`) of a URL that came from the client is
  **SSRF** unless the destination is validated against an allowlist. Attackers target
  `169.254.169.254` (cloud metadata), `localhost`, and internal hosts. Block private/loopback/
  link-local ranges and non-http(s) schemes; prefer an explicit allowlist.

### 4. Cross-site scripting (XSS)
- In React, `dangerouslySetInnerHTML` with any value that originated from user input is **stored XSS**.
  Render as text, or sanitize with a vetted library (e.g., DOMPurify) if HTML is truly required.
- On the server, data stored now but rendered later still counts — trace the sink.

### 5. Secrets & configuration
- Hard-coded tokens, API keys, passwords, or private URLs in source. (A deliberate demo credential is
  fine only if clearly marked and non-production.)
- Overly permissive CORS (`allow_origins=["*"]` with credentials), debug mode on, verbose errors.

### 6. Other Top-10 quick checks
- Insecure deserialization (`eval`, `Function`, unsafe `JSON`/YAML parsing of untrusted input).
- Missing authn on a state-changing route. Mass assignment. Unbounded input.

## Output format
For each finding:

```
[SEVERITY: high|medium|low] <Vulnerability class> — <file>:<line>
  What:    <one-line description of the flaw>
  Exploit: <concrete attacker action and impact>
  Fix:     <specific, minimal remediation>
  Confidence: <high|medium|low — and why, especially for anything that could be a false positive>
```

End with a short summary: counts by severity, and an explicit **"reviewed-safe"** list of things you
checked and judged NOT vulnerable (so the team can see the false-positive call was made deliberately).

<!-- VERIFY: skills layout (`.claude/skills/<name>/SKILL.md`) and the frontmatter keys
     (`name`, `description`) against your installed Claude Code version. Skills are model-invoked based
     on the `description`, so keep it explicit about when to trigger. -->
