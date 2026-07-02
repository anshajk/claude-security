# Anti-Slop Review Checklist

Score one point per item you can both **spot** and **explain** in the diff
(`git diff main...slop/part-1`). Slop is *plausible-but-wrong*, so read for intent, not just syntax.

## 1. Correctness & logic
- [ ] **Does each helper actually do what its name/comment claims?** Re-derive the logic from scratch;
      don't trust the name. (Watch for inverted comparisons and wrong defaults.)
- [ ] **Off-by-one / boundary errors** in slices, ranges, pagination, limits.
- [ ] **Dead or unreachable branches** — conditions that can never be true given the data model.

## 2. Copy-paste drift
- [ ] **Was this block copied from somewhere else and not fully adapted?** Check status strings,
      field names, route paths, and log messages against the *new* intent.
- [ ] **Right identifier, right object?** (e.g., passing `unit_id` where `id` was meant.)

## 3. Error handling
- [ ] **Swallowed errors** — `try/except: pass`, empty catch blocks, ignored return values that hide
      real failures.

## 4. Tests that assert nothing
- [ ] **Does each test actually assert the behavior it names?** A test that only checks "not None" or
      "status_code or True" is *worse* than no test — it's a green light with no engine.
- [ ] **Is there at least one assertion on the value that matters**, not just that the call returned?

## 5. Hygiene
- [ ] Unused parameters/imports, misleading comments, contradictory docstrings.

---
**Scoring:** 8 defects planted. 6/8 = solid. 8/8 = you can probably stop reading line-by-line and
start trusting contracts. Note *which* you missed — that gap is your personal anti-slop blind spot.
