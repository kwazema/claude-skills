# kw-skills

Claude Code skills for frontend development workflows. Focused on TypeScript, React, Supabase, Vite, and code quality tooling.

## Install

```bash
# All skills
npx skills add kwazema/claude-skills

# Single skill
npx skills add kwazema/claude-skills --skill kw-stack-audit
```

## Skills

| Skill | What it does | Triggers |
|-------|-------------|----------|
| [kw-stack-audit](./skills/kw-stack-audit/) | Audit frontend project quality (TS, formatter, Supabase types, deps, secrets) | `stack audit`, `revisar el stack` |
| [kw-find-docs](./skills/kw-find-docs/) | Look up current docs and code examples for any library via Context7 | Activates when writing code with external packages |
| [kw-check-migrations-supabase](./skills/kw-check-migrations-supabase/) | Review and apply pending Supabase migrations with explanations | `check migrations`, `push migrations` |
| [kw-login-supabase-cli](./skills/kw-login-supabase-cli/) | Set up Supabase CLI auth and project linking | `login supabase`, `conectar supabase` |
| [kw-vite-checker-setup](./skills/kw-vite-checker-setup/) | Configure vite-plugin-checker + vite-plugin-terminal for terminal errors | `vite checker`, `errores en terminal` |
| [kw-update-skills](./skills/kw-update-skills/) | Update all external third-party skills | `update skills`, `actualizar skills` |
| [kw-code-cleanup](./skills/kw-code-cleanup/) | Add a code quality cleanup phase to a GSD milestone | `code cleanup`, `limpieza de codigo` |
| [kw-gsd-fortify](./skills/kw-gsd-fortify/) | Deep codebase analysis before GSD phase execution (4 parallel agents) | `fortify phase`, `fortificar fase` |
| [kw-gsd-phase-handoff](./skills/kw-gsd-phase-handoff/) | Prepare a clean chat for `gsd-execute-phase` and ask only material handoff questions | `te voy a pasar el execute`, `phase handoff` |
| [kw-cubic](./skills/kw-cubic/) | Process cubic.ai code review and apply changes that fit the architecture | `cubic`, `cubic review` |
| [kw-skill-docs](./skills/kw-skill-docs/) | Generate a comprehensive catalog of all installed skills | `skill docs`, `documentar skills` |
| [kw-audit-references](./skills/kw-audit-references/) | Audit .planning/reference/ docs against codebase with parallel agents | Manual: `/kw-audit-references` |
| [kw-optimize-agents-project](./skills/kw-optimize-agents-project/) | Optimize AGENTS.md for minimal context footprint, scaffold reference docs | Manual: `/kw-optimize-agents-project` |

## How skills work

Skills are installed into `~/.claude/skills/` and loaded automatically by [Claude Code](https://docs.anthropic.com/en/docs/claude-code) based on trigger phrases in the conversation. Each skill contains agent instructions that guide Claude through a specific workflow.

The [skills CLI](https://skills.sh) manages installation and updates. It supports 40+ AI coding agents (Claude Code, Cursor, Windsurf, Gemini CLI, etc.).

## Repository structure

```
skills/
  kw-skill-name/
    README.md        # Human-readable overview (what you see on GitHub)
    SKILL.md         # Agent workflow specification (what the AI reads)
    references/      # Extended documentation for complex skills
```

## Contributing

1. Create `skills/kw-{name}/` with `SKILL.md` and `README.md`
2. `SKILL.md` must have YAML frontmatter with `name` and `description` fields
3. Keep `SKILL.md` under 200 lines — use `references/` for detailed content
4. Include both English and Spanish trigger words in the description
5. Update the skills table in this README

## Requirements

- [Claude Code](https://docs.anthropic.com/en/docs/claude-code) or any agent supported by the [skills CLI](https://skills.sh)
- Node.js 18+
