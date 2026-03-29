# kw-gsd-fortify

Deep codebase analysis that prepares a GSD phase for execution. Enriches CONTEXT.md and annotates PLAN.md files so the executor produces correct code on the first pass.

## Install

```bash
npx skills add kwazema/claude-skills --skill kw-gsd-fortify
```

## What it does

- Spawns 4-5 parallel agents: cascade impact, pattern scout, data layer analyst, risk hunter, and UI compliance reviewer (when UI-SPEC.md exists)
- Detects unplanned files affected by planned changes (cascade impact)
- Finds existing code patterns the executor should follow
- Maps database tables, RLS policies, hooks, and migration order
- Identifies risks with severity and mitigation strategies
- Validates plans against UI-SPEC design contracts and shadcn registry (when UI-SPEC.md exists)
- Flags custom component needs for user input instead of inventing solutions
- Presents findings interactively before writing anything
- Enriches CONTEXT.md with deep analysis sections (including `<ui_compliance>`)
- Appends `<fortify_notes>` and `<fortify_notes_ui>` to each PLAN.md with per-task guidance

## Example

> "Fortify phase 13"

Claude will analyze the codebase against the phase plans, present gaps and risks, ask questions, then enrich the artifacts.

## Triggers

`fortify phase`, `fortify`, `fortificar fase`

**Requires:** [Get Shit Done (GSD)](https://github.com/get-shit-done-ai/get-shit-done) workflow.

See [SKILL.md](./SKILL.md) for the full workflow.
