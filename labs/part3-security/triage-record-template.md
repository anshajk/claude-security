# Triage Record — <finding short name>

> Copy this file per finding triaged (e.g. `triage-clips-idor.md`). Both real bugs and false
> positives get a record. A dismissal without written reasoning is not a triage.

- **Finding:** <one line — what the tool/reviewer reported>
- **Reported by:** <owasp-review skill | security-reviewer subagent | human reviewer>
- **Location:** `<file>:<line>`
- **Date / reviewer:** <date> / <name>

## 1. Evidence
What the code actually does (quote the relevant lines, trace input → sink):

```
<paste the lines>
```

## 2. Reachability
- Is the dangerous input reachable from an untrusted caller? <yes/no — how>
- For access-control findings: is there a tenant/owner predicate? <yes/no>
- Reproduction attempt (command + result), if applicable:

```
<curl / test command>
<observed result>
```

## 3. Verdict
- [ ] **Real vulnerability** — severity: <high/medium/low>
- [ ] **False positive** — safe because: <reason, with the evidence that proves it>

## 4. Decision & action
- **If real:** remediation taken or proposed (diff/PR link), tests added (incl. at least one
  human-authored assertion on the security path), re-run result.
- **If false positive:** why no change is needed, and any low-cost hardening applied anyway.

```
<remediation diff or "dismissed — no change">
```

## 5. Sign-off
- Reviewer: <name>   •   Second pair of eyes (if security-relevant): <name>
