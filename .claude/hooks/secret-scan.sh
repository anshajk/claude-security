#!/usr/bin/env bash
# Secret-scanning hook for the Command Center bootcamp.
#
# Wired as a PreToolUse hook on Edit/Write (see .claude/settings.json). It inspects the content about
# to be written and blocks the write if it looks like a hard-coded secret. Exit non-zero to deny.
#
# Claude Code passes the tool invocation as JSON on stdin. We read it, pull out the proposed file
# content, and grep for high-signal secret patterns. This is a TEACHING template (Part 3); Day 4
# covers writing hooks from scratch.
#
# VERIFY: the PreToolUse stdin JSON shape and the field that carries the new file content
#         (e.g. .tool_input.content / .tool_input.new_string) against your installed Claude Code
#         version. Adjust the jq paths below to match. The block/allow contract here is "exit 2 to
#         deny"; confirm your version's hook decision protocol.
set -euo pipefail

payload="$(cat)"

# Pull the proposed content out of the tool input (covers Write and Edit shapes).
content="$(printf '%s' "$payload" | jq -r '
  .tool_input.content
  // .tool_input.new_string
  // .tool_input.new_str
  // empty' 2>/dev/null || true)"

# Nothing to inspect -> allow.
[ -z "${content:-}" ] && exit 0

# The seed demo tokens are intentionally public teaching credentials, not secrets. Strip them before
# scanning so the hook doesn't flag the bootcamp's own fixtures.
content="$(printf '%s' "$content" | sed -E 's/(acme-operator-token|acme-admin-token|globex-operator-token)//g')"

# High-signal secret patterns.
patterns=(
  'AKIA[0-9A-Z]{16}'                                  # AWS access key id
  'aws_secret_access_key[[:space:]]*=[[:space:]]*[A-Za-z0-9/+]{40}'
  '-----BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY-----'   # private keys
  'gh[pousr]_[A-Za-z0-9]{36,}'                         # GitHub tokens
  'xox[baprs]-[A-Za-z0-9-]{10,}'                       # Slack tokens
  '(api[_-]?key|secret|password|passwd|token)[[:space:]]*[:=][[:space:]]*["'\''][A-Za-z0-9/+_-]{16,}["'\'']'
)

for re in "${patterns[@]}"; do
  # -e guards against patterns that begin with '-' (e.g. the private-key header).
  if printf '%s' "$content" | grep -EiqI -e "$re"; then
    echo "secret-scan: blocked write — content matches a secret pattern: /$re/" >&2
    echo "If this is a false positive, store the value in an env var or a gitignored .env, not in source." >&2
    exit 2
  fi
done

exit 0
