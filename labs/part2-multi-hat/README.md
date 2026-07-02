# Part 2 Lab — Adversarial Review: Multi-Hat Thinking

**Goal:** Get judgments that are not the author's: independent single-hat reviewers surface tradeoffs a single all-in-one reviewer hides.

## Why single-hat

One reviewer asked to be "secure and DRY and performant all at once" does each shallowly. Narrow reviewers go deep and disagree, and the disagreement is the value.

## What you review

Review the Day-2 running build on `slop/part-1`. Run `make slop` if it is not applied.

The black-box hat targets the baseline API contract where the clips IDOR lives. It may read ONLY `contracts/openapi.yaml`, never the source. It catches that a cross-org request returns data where the contract promises 404.

## What you do

1. Run the TWO required hats in separate Claude Code sessions. Capture each output verbatim. Do not let the hats see each other.
   - Security hat: `/hat-security main...slop/part-1`
   - Black-box hat: start the API with `make dev-api`, then run `/hat-blackbox http://localhost:8000`.
     This hat may read ONLY `contracts/openapi.yaml`, never the source.
2. In a fresh session, ask one all-in-one reviewer to "review this diff for security, design, performance, and correctness all at once." Save its output.
3. Fill in `comparison-rubric.md`.
   - What did only an independent hat find?
   - Where did hats disagree?
   - What did the all-in-one reviewer smooth over or miss?

Headline: the black-box hat catches the clips IDOR from the contract alone. The all-in-one reviewer usually misses it.

Optional extra: `/hat-design` exists. You can run it after the required hats. It is not required. Its old job, wanting to "fix" the allowlisted ORDER BY that security marks reviewed-safe, is only a small aside.

## The hard line

Each engineer writes ONE human-authored assertion on the critical path. Never ship AI code with only AI-written tests.

Keep this test human-authored:

```ts
// backend/tests/tenant_isolation.test.ts  (human-authored)
test("cross-org clip access is denied", async () => {
  // Acme operator must NOT be able to read Globex's footage.
  const res = await client().inject({
    url: "/clips/clip_globex_1",
    headers: { authorization: "******" },
  });
  expect(res.statusCode).toBe(404); // cross-tenant footage leak (IDOR)
});
```

It fails on baseline, which proves the bug. It passes after Part 3's fix.

## Files

- `comparison-rubric.md`
- `answer-key.md` — facilitator only
