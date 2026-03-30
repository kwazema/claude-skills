# kw-gsd-phase-handoff

Prepare a clean chat for a subsequent `gsd-execute-phase` by rebuilding missing phase context and surfacing only the doubts that materially change execution.

## Install

```bash
npx skills add kwazema/claude-skills --skill kw-gsd-phase-handoff
```

## What it does

- Prepares a clean chat before the user passes `gsd-execute-phase`
- Rebuilds phase understanding from `.planning/` when the phase can be identified
- Cross-checks `STATE.md`, `CONTEXT.md`, `PLAN.md`, and `UI-SPEC.md` when relevant
- Asks only targeted questions for real contradictions, missing decisions, or risky gaps
- Avoids re-opening decisions that are already locked
- Leaves the chat ready for `gsd-execute-phase` once the handoff is clear

## Example

> "Activa gsd phase handoff. Ahora te voy a pasar `gsd-execute-phase 6` en un chat limpio"

Claude will rebuild the phase context, flag only material issues, and leave the chat ready for `gsd-execute-phase`.

## Triggers

`gsd phase handoff`, `te voy a pasar el execute`, `before execute-phase`, `phase handoff`, `human in the loop`

**Requires:** [Get Shit Done (GSD)](https://github.com/get-shit-done-ai/get-shit-done) workflow.

See [SKILL.md](./SKILL.md) for the full workflow.
