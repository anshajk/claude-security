# PR-Gate Recipe — how the four gates compose

Day 3's deliverable is not four separate habits; it's **one merge standard** the whole team inherits.
Each gate catches a different failure mode, and they layer:

| Gate | Lives in | Catches | Type |
| ---- | -------- | ------- | ---- |
| **Self-verify loop** | `.claude/skills/self-verify/SKILL.md` | the agent's own build/test/lint mistakes, before you see the diff | judgment + deterministic, pre-review |
| **Multi-hat review** | `.claude/skills/hat-*/SKILL.md` | tradeoffs & contract violations a single reviewer hides (e.g. clips IDOR) | judgment, independent |
| **OWASP skill + security subagent** | `.claude/skills/owasp-review/`, `.claude/agents/security-reviewer.md` | injection, IDOR, SSRF, XSS as the code is written and at review | judgment, security-focused |
| **Secret-scan hook** | `.claude/hooks/secret-scan.sh` (wired in `settings.json`) | hard-coded secrets, at the moment of write | deterministic, blocking |
| **Permissions baseline** | `.claude/settings.json` | dangerous tool actions; keeps flow on safe ones | deterministic, committed |
| **CODEOWNERS** | `.github/CODEOWNERS` | merges to high-blast-radius code without a human security reviewer | human, blocking |
| **CI** | `.github/workflows/ci.yml` | anything the local gates skipped; runs on every PR | deterministic, blocking |

## The merge contract for the running build
A PR may merge only when **all** of the following are true:
1. `make lint && make test && make build` is green (locally via `/self-verify`, enforced by CI).
2. The diff passed a **multi-hat** pass; any disagreement is recorded.
3. An **OWASP/security** pass ran on meaningful diffs; findings are fixed or triaged in writing
   (`labs/part3-security/triage-record-template.md`).
4. There is **at least one human-authored assertion** on anything that matters (e.g. the cross-tenant
   clips test).
5. The **secret-scan** hook and CI **gitleaks** job are green.
6. Security-relevant paths got a **CODEOWNERS** human review.

## Why this order
Cheap/deterministic gates run first (self-verify, hooks, lint) so human judgment is spent only on what
machines can't catch. Independent review and the human assertion are last because they're the most
expensive and the most irreplaceable — exactly the work that should *not* be automated away.

> Day 4 mechanizes the judgment gates (agent teams running the hats; hooks authored from scratch).
> Day 3's job is to make the standard real and committed first.
