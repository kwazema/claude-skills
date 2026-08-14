# kw-skills

Claude Code skills for frontend development workflows. Focused on TypeScript, React, Supabase, Vite, and code quality tooling.

## Install

Skills are managed by the [skills CLI](https://skills.sh) (`npx skills`). No global install needed — `npx` fetches it on demand.

**Install all skills from this repo:**
```bash
npx skills add kwazema/claude-skills
```

**Install a single skill:**
```bash
npx skills add kwazema/claude-skills --skill kw-stack-audit
```

**Install globally** (`~/.claude/skills/` instead of the current project's `.claude/skills/`):
```bash
npx skills add kwazema/claude-skills -g
```

**Install to a specific agent** (default: interactive picker across all detected agents — Claude Code, Cursor, Windsurf, etc.):
```bash
npx skills add kwazema/claude-skills --agent claude-code
```

**Preview what a repo contains without installing anything:**
```bash
npx skills add kwazema/claude-skills --list
```

## Managing skills

Everyday commands, once you have skills installed from any source (this repo or others):

| Command | What it does |
|---|---|
| `npx skills list` | List skills installed in the current project |
| `npx skills list -g` | List global skills |
| `npx skills update` | Update all skills to their latest version (prompts for project vs. global scope) |
| `npx skills update -g -y` | Update all global skills, no prompts — the form to use non-interactively |
| `npx skills update kw-stack-audit` | Update a single skill by name |
| `npx skills find typescript` | Search skills.sh by keyword |
| `npx skills remove` | Interactive picker to remove installed skills |
| `npx skills remove kw-stack-audit` | Remove a specific skill by name |

Full reference: `npx skills --help`.

> The [kw-update-skills](./skills/kw-update-skills/) skill in this repo wraps `npx skills update` — say "update skills" in a Claude Code chat and it runs the command for you instead of typing it in a terminal.

## Skills

| Skill | What it does | Triggers |
|-------|-------------|----------|
| [kw-stack-audit](./skills/kw-stack-audit/) | Audit frontend project quality (TS, formatter, Supabase types, deps, secrets) | `stack audit`, `revisar el stack` |
| [kw-find-docs](./skills/kw-find-docs/) | Look up current docs and code examples for any library via Context7 | Activates when writing code with external packages |
| [kw-check-migrations-supabase](./skills/kw-check-migrations-supabase/) | Review pending Supabase changes (migrations + edge functions) and deploy with confirmation | `check migrations`, `deploy functions`, `check supabase` |
| [kw-login-supabase-cli](./skills/kw-login-supabase-cli/) | Set up Supabase CLI auth and project linking | `login supabase`, `conectar supabase` |
| [kw-vite-checker-setup](./skills/kw-vite-checker-setup/) | Configure vite-plugin-checker + vite-plugin-terminal for terminal errors | `vite checker`, `errores en terminal` |
| [kw-update-skills](./skills/kw-update-skills/) | Update all external third-party skills | `update skills`, `actualizar skills` |
| [kw-code-cleanup](./skills/kw-code-cleanup/) | Add a code quality cleanup phase to a GSD milestone | `code cleanup`, `limpieza de codigo` |
| [kw-gsd-fortify](./skills/kw-gsd-fortify/) | Deep codebase analysis before GSD phase execution (4 parallel agents) | `fortify phase`, `fortificar fase` |
| [kw-gsd-phase-handoff](./skills/kw-gsd-phase-handoff/) | Prepare a clean chat for `gsd-execute-phase` and ask only material handoff questions | `te voy a pasar el execute`, `phase handoff` |
| [kw-gsd-help-flow](./skills/kw-gsd-help-flow/) | Agente de ruteo del pipeline GSD (4 modos): chuleta, ruteo por tarea, temático (`skills para X`), deep-dive (`explícame gsd-X`) | `cómo empiezo`, `flujo gsd`, `skills para`, `explícame gsd-` |
| [kw-cubic](./skills/kw-cubic/) | Process cubic.ai code review and apply changes that fit the architecture | `cubic`, `cubic review` |
| [kw-pr-review](./skills/kw-pr-review/) | Read bot reviews from a GitHub PR (Codex, CodeRabbit, Sourcery), evaluate findings against the architecture, apply only the valid ones | `pr review`, `codex review`, `revisar pr`, `aplicar findings` |
| [kw-skill-docs](./skills/kw-skill-docs/) | Generate a comprehensive catalog of all installed skills | `skill docs`, `documentar skills` |
| [kw-audit-references](./skills/kw-audit-references/) | Audit .planning/reference/ + .planning/codebase/ docs (+ CLAUDE.md, PROJECT.md) against the codebase with parallel agents | Manual: `/kw-audit-references` |
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
