# kw-cubic

Process cubic.ai code review output and apply only the changes that make architectural sense.

## Install

```bash
npx skills add kwazema/claude-skills --skill kw-cubic
```

## What it does

- Takes cubic.ai's external code review analysis as input
- Reads project context from `.planning/` artifacts
- Filters suggestions through the project's actual architecture
- Applies only changes that have real impact (no cosmetic fixes)
- Skips anything that contradicts existing patterns or touches auto-generated files

## Example

> "/kw-cubic [paste cubic.ai output here]"

Claude will read the project context, evaluate each suggestion from cubic.ai against the codebase, and apply the ones that make sense.

## Triggers

`cubic`, `cubic review`, `cubic analysis`, `review de cubic`

**Requires:** [Get Shit Done (GSD)](https://github.com/get-shit-done-ai/get-shit-done) workflow and a [cubic.ai](https://cubic.ai) account.

See [SKILL.md](./SKILL.md) for the full workflow.
