# kw-pr-review

Read bot reviews from a GitHub PR (Codex, CodeRabbit, Cubic, Sourcery), evaluate each finding against the project's architecture with parallel agents, and apply only the ones with real impact.

## Install

```bash
npx skills add kwazema/claude-skills --skill kw-pr-review
```

## What it does

- Reads inline + top-level comments from any GitHub PR via `gh` CLI
- Normalizes findings from multiple bots into a single schema (severity, path, line, title)
- Loads project context from `.planning/` and `CLAUDE.md`
- Spawns one agent per affected file in parallel — classifies each finding as APPLY / DISCARD / DEBATE with reasoning
- Asks the user about DEBATE items, then applies approved fixes with atomic commits (one commit per fix)
- Never auto-triggers — manual-only

## Examples

> `/kw-pr-review`

Autodetects the PR from the current branch, reads all reviewer-bot findings, evaluates them, asks about ambiguous ones, applies the approved fixes.

> `/kw-pr-review 13`

Same as above but for PR `#13` of the current repo (derived from `git remote`).

> `/kw-pr-review 13 --severity P1 --source codex --dry-run`

Only Codex P1 findings, analysis only — shows the plan but applies nothing.

## Triggers

`pr review`, `revisar pr`, `codex review`, `coderabbit review`, `review del pr`, `aplicar findings`, `/kw-pr-review`

**Requires:** [`gh` CLI](https://cli.github.com) authenticated against the repo's GitHub account. Optionally [Get Shit Done (GSD)](https://github.com/get-shit-done-ai/get-shit-done) for `.planning/` context.

See [SKILL.md](./SKILL.md) for the full workflow and [references/bot-formats.md](./references/bot-formats.md) for per-bot parsing rules.
