# Layer a gate — one rule isn't enough

Some things must **never** leak: the `.env`, a footage URL, the `deterrent` endpoint. A single
`deny` rule feels like enough. It isn't. This walkthrough shows the blind spot, then layers
protection until the leak is actually closed.

You'll build up **three layers**. Each one catches what the layer before it misses.

---

## Layer 1 — the permission rule

`.claude/settings.json` already denies reading env files:

```jsonc
// deny
"Read(./**/.env)",
"Read(./**/.env.*)"
```

**Try it (in Claude Code):** ask the agent to `cat .env` or to read `.env` with its file tool.
Both are blocked. 

This covers the **obvious path**: the agent's own Read tool, plus shell commands Claude Code
recognises like `cat`, `head`, `tail`, or `sed` on `.env`.

**The blind spot:** the rule only knows about tools and commands it can see. It does **not**
look inside a script.

**See it slip past (safe to run in a scratch folder):**

```bash
mkdir -p /tmp/envdemo && cd /tmp/envdemo
printf 'API_KEY=super-secret-value\n' > .env
printf "print(open('.env').read())\n" > leak_env.py
python3 leak_env.py            # prints the secret — the deny rule never fired
```

The command was `python3 leak_env.py`. The string `.env` never appears in it, so no rule and
no simple pattern can catch it. The script opened the file itself.

---

## Layer 2 — a PreToolUse hook

A hook is your own script that runs **before** a tool call and can block it — even something an
`allow` rule would let through. (You met one in Part 3: `secret-scan.sh`.)

A hook can catch the command *shapes* you can describe. For example, a `Bash` matcher that
refuses any command mentioning `.env`:

```bash
# pseudo-hook: exit 2 = block
grep -qE '\.env' <<< "$COMMAND" && { echo "blocked: touches .env" >&2; exit 2; }
```

This re-catches `cat .env` and friends — good defense in depth.

**But notice:** it still does **not** stop `python3 leak_env.py`, because that command doesn't
mention `.env` either. Hooks catch what you can pattern-match. A determined script — or a
prompt injection that writes one — walks past both the rule and the hook.

---

## Layer 3 — the sandbox

The only layer that stops the script is an **OS-level sandbox**: the operating system fences off
files and the network for the `Bash` tool **and every child process it spawns**. Now
`python3 leak_env.py` can't open `.env` at all, because the file is outside the sandbox — and it
holds even if a prompt injection is driving the agent.

We don't wire the sandbox in this lab. The point is to understand the limitations.
rules and hooks guard the paths you can name; the sandbox guards the ones you can't.

---

## Discuss

- For the Command Center, what belongs behind all three layers? (Start with: `.env`, customer
  footage URLs, the `deterrent` endpoint.)
- Where is a rule enough on its own, and where do you really need the sandbox?
- Clean up when done: `rm -rf /tmp/envdemo`.

**Takeaway:** defense in depth. No single gate is enough — each layer catches what the one
before it misses.
