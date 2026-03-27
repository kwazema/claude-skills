# kw-gsd-fortify

Deep codebase analysis that prepares a GSD phase for execution. Enriches CONTEXT.md and annotates PLAN.md files so the executor produces correct code on the first pass.

## Install

```bash
npx skills add kwazema/claude-skills --skill kw-gsd-fortify
```

## What it does

- Spawns 4 parallel agents: cascade impact, pattern scout, data layer analyst, risk hunter
- Detects unplanned files affected by planned changes (cascade impact)
- Finds existing code patterns the executor should follow
- Maps database tables, RLS policies, hooks, and migration order
- Identifies risks with severity and mitigation strategies
- Presents findings interactively before writing anything
- Enriches CONTEXT.md with deep analysis sections
- Appends `<fortify_notes>` to each PLAN.md with per-task guidance

## Example

> "Fortify phase 13"

Claude will analyze the codebase against the phase plans, present gaps and risks, ask questions, then enrich the artifacts.

## Triggers

`fortify phase`, `fortify`, `fortificar fase`

**Requires:** [Get Shit Done (GSD)](https://github.com/get-shit-done-ai/get-shit-done) workflow.

See [SKILL.md](./SKILL.md) for the full workflow.
