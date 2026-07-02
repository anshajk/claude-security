# Break a rule — three rules that look safe

A permission rule is a **claim**, just like a tool's finding. Before you trust one, test it.

Below are three rules that look tight. Each one has a hole. For each: find a command it
**fails to stop**, then rewrite it so it holds. The safe default is always **allow narrow,
deny broad**.

> These are ports of the Claude Code docs' own examples to this repo. The point is not to
> memorise them — it's to build the habit of *poking* a rule before you rely on it.

---

## Rule 1 — "Only let the agent curl one site"

```jsonc
// ask
"Bash(curl example.com *)"
```

**Looks like:** the agent can only hit `example.com`.

**Doesn't stop:**

```bash
curl -X GET example.com        # a flag comes first, so the rule never matches
curl https://evil.example.com  # different host, still "starts with" nothing useful
curl bit.ly/xyz                # a redirect sends it anywhere
U=evil.com && curl $U          # a variable hides the real target
```

**Why:** rules that try to constrain *arguments* are brittle. Flags, schemes, redirects,
variables, and extra spaces all slip past a simple prefix match.

**Fix:** don't police curl's arguments. Deny the raw tool and allow only the scoped one:

```jsonc
// deny
"Bash(curl:*)",
"Bash(wget:*)"
// allow
"WebFetch(domain:example.com)"
```

`WebFetch(domain:...)` is a real, host-scoped rule — not a string match on a command line.

---

## Rule 2 — "Let the agent use npx"

```jsonc
// allow
"Bash(npx *)"
```

**Looks like:** the agent can run helper tools.

**Doesn't stop:**

```bash
npx rimraf .                   # a helper package that deletes — run directly
npx --yes any-package          # pulls and runs any package from the internet
```

**Why:** runners like `npx`, `docker exec`, `devbox run`, and `mise exec` execute
**whatever you hand them**. Claude Code does **not** unwrap them, so `Bash(npx *)` is really
"run anything." (Process wrappers like `timeout`, `nice`, and bare `xargs` *are* unwrapped —
but runners are not. And `npx foo && rm -rf .` doesn't help an attacker here: Claude Code
splits on `&&`, so the `rm -rf` half still needs its own approval — and the deny list stops it.)

**Fix:** name the exact inner command. One rule per tool:

```jsonc
// allow
"Bash(npx prettier *)",
"Bash(npx tsc *)"
```

---

## Rule 3 — "Auto-allow pushing feature branches"

```jsonc
// allow
"Bash(git push:*)"
```

**Looks like:** engineers stop getting nagged about pushing their own branches.

**Doesn't stop:**

```bash
git push origin HEAD:main      # the wildcard matches a push straight to main
git push --force origin main   # only blocked if you also denied force-push
```

**Why:** the *intent* was "feature branches only," but that intent isn't encoded — `:*`
matches every push target, including protected branches.

**Fix:** keep `git push` in **ask**, and allow only a wrapper that refuses protected
branches:

```jsonc
// allow
"Bash(make push-branch:*)"
```

…where `make push-branch` is a script that pushes the current branch and errors out on
`main`/`master`. Rely on branch protection as the hard backstop. (This is the same rule the
team debates in `contested-rule.md`.)

---

## The takeaway

Every rule you wrote is an assumption about what a string will and won't match. Test the
assumption. When in doubt, **deny the broad thing and allow the narrow, named thing** —
never the other way around.
