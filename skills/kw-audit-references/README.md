# kw-audit-references

Deep audit of `.planning/reference/` docs, `AGENTS.md`, and `PROJECT.md` against the current codebase and milestone changes.

## What it does

1. Reads milestone context (STATE.md, ROADMAP.md, phase summaries) to build a changelog
2. Spawns parallel agents — one per reference document — to check every claim against actual code
3. Each agent runs two passes: textual analysis (paths, functions, status claims) and behavioral verification (does the code do what the doc says?)
4. Parent agent synthesizes findings, discards false positives, and generates a scored report
5. Presents an interactive summary where you decide: fix / skip / discuss for each finding

## Triggers

Manual-only. Invoke with `/kw-audit-references` or `/kw-audit-references --full`.

- No args: audits reference docs + AGENTS.md + PROJECT.md
- `--full`: also audits phase artifacts (CONTEXT.md, PLAN.md)

## Output

- `.planning/REFERENCE-AUDIT-v{milestone}.md` — unstaged report for review
- Interactive chat summary with per-finding decisions

## When to use

- Closing a milestone
- After major refactors that may have drifted docs
- When reference docs feel stale
