# kw-skill-docs

Generate a comprehensive catalog of all installed Claude Code skills for reference.

## Install

```bash
npx skills add kwazema/claude-skills --skill kw-skill-docs
```

## What it does

- Scans all local skills in `~/.claude/skills/`
- Catalogs built-in skills from the system prompt
- Classifies each by activation type, arguments, and dependencies
- Detects incompatibilities between UI skills
- Generates a structured prompt to create a .docx reference document

## Example

> "/kw-skill-docs"

Claude will scan your environment, catalog everything, and give you a prompt to paste into Claude for .docx generation.

## Triggers

`skill docs`, `document skills`, `list all skills`, `documentar skills`, `catalogo de skills`

See [SKILL.md](./SKILL.md) for the full workflow.
