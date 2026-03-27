# kw-code-cleanup

Add a code quality cleanup phase to a GSD milestone based on real diagnostics.

## Install

```bash
npx skills add kwazema/claude-skills --skill kw-code-cleanup
```

## What it does

- Runs `npm run lint` and `npm outdated` to gather real diagnostics
- Presents findings scoped to code touched in the current milestone
- Proposes a cleanup phase with tasks adapted to what was actually found
- Creates the phase in the GSD roadmap (does not execute it)

## Example

> "Add a code cleanup phase" or "Cleanup phase"

Claude will run diagnostics, show you a summary, and create a GSD phase with the approved tasks.

## Triggers

`code cleanup`, `cleanup phase`, `add cleanup phase`, `limpieza de codigo`

**Requires:** [Get Shit Done (GSD)](https://github.com/get-shit-done-ai/get-shit-done) workflow.

See [SKILL.md](./SKILL.md) for the full workflow.
