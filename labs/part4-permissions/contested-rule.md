# Contested Rule — debate & decision record

A permissions baseline is only real if the team has argued the hard cases and written down where it
landed. Pick the planted rule below (or one your team actually fights about) and run the debate.

## The planted contested rule
> **Should the team auto-allow `Bash(git push:*)` to feature branches?**
> (It currently sits in **ask** in `.claude/settings.json`.)

### The case FOR auto-allow (flow)
- Pushing a feature branch is low-risk and reversible; branch protection guards `main`.
- Constant push prompts are the single most common flow-breaker; they train people to click "yes"
  without reading — which is *worse* for the prompts that matter.
- CI + CODEOWNERS are the real gate; the push itself changes nothing protected.

### The case AGAINST (safety / auditability)
- `git push:*` is a wildcard — it can match `git push origin HEAD:main` or a push to a protected
  branch if protection is misconfigured. The "feature branch only" intent isn't actually encoded.
- Push is the moment code leaves the laptop; a deliberate pause there is cheap and auditable.
- Auto-allowing one outward-facing action erodes the principle that outward actions are "ask".

### The synthesis the room often reaches
- Keep `git push:*` in **ask**, but **allow a narrowly-scoped push** that can't hit `main`
  (e.g., a wrapper script `make push-branch` that refuses protected branches), and rely on branch
  protection as the hard backstop. Encodes the *intent*, not a broad wildcard.

## Decision record (fill in)
- **Rule debated:** auto-allow `git push` to feature branches?
- **Decision:** [ ] allow  [ ] ask  [ ] deny  [ ] allow-but-scoped (describe): ____________________
- **Vote / sense of the room:** ____ for / ____ against
- **Primary reason for the decision:** ______________________________________________
- **Recorded dissent (the strongest opposing point):** _____________________________
- **Revisit trigger (what would change our mind):** ________________________________

## Other rules worth a 2-minute argument (if time)
- `WebFetch` — ask vs. deny-by-default? (data-exfiltration & prompt-injection surface)
- `Edit(.claude/**)` — should the agent be able to edit its own permissions? (currently **ask**)
- `Bash(curl:*)` — ask, while `curl http://localhost:*` is allowed; is that the right split?
