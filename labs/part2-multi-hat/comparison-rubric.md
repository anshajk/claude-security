# Multi-Hat Comparison Rubric

Fill this in during Activity C. The point is not a score — it's *evidence* that independence surfaces
what a single reviewer hides.

## 1. Findings by source
Mark where each finding was caught. ✅ = caught, — = missed.

| # | Finding | Security hat | Design hat | Black-box hat | All-in-one |
| - | ------- | :----------: | :--------: | :-----------: | :--------: |
| 1 | Acknowledge marks alert `resolved` (semantic drift) | | | | |
| 2 | `is_overdue` comparison inverted | | | | |
| 3 | `recent_unacked` off-by-one (`limit - 1`) | | | | |
| 4 | Swallowed error on notes write (`except: pass`) | | | | |
| 5 | Dead `priority == "critical"` branch | | | | |
| 6 | Vacuous tests assert nothing | | | | |
| 7 | Front-end acks by `unit_id` not `id` | | | | |
| 8 | `acknowledgeAlert` POSTs to `/resolve` (drift) | | | | |
| 9 | **Clips IDOR — cross-tenant footage leak** | | | ✅ (expected) | |
| 10 | SSRF on `/units/{id}/callback` | | | | |
| 11 | Stored XSS on operator notes | | | | |

## 2. Independence payoff
- **Found ONLY via an independent hat** (no other source caught it):
  - …
- **The black-box hat's headline:** did it catch the clips IDOR from the contract alone? On what
  evidence (which request → which response vs. the contract's promise)?
  - …

## 3. Disagreements = exposed tradeoffs
Where did two hats pull in opposite directions? (e.g., design hat wants to "fix" the allowlisted
`ORDER BY` interpolation; security hat marks it reviewed-safe.) What did the disagreement reveal that
a single reviewer would have silently resolved?
- Disagreement: …
- Tradeoff it exposed: …

## 4. What the all-in-one smoothed over
List findings the single combined reviewer missed, under-rated, or blended away:
- …

## 5. Takeaway (one sentence)
The finding I would have missed reviewing alone: …
