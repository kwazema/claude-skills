# kw-skills

Claude Code skills for frontend development workflows.

## Install

```bash
# All skills
npx skills add kwazema/claude-skills

# Single skill
npx skills add kwazema/claude-skills --skill kw-stack-audit
```

## Skills

| Skill | Description |
|-------|-------------|
| **kw-stack-audit** | Audit frontend project quality config (TypeScript, formatter, Supabase types, deps, security, testing) |
| **kw-find-docs** | Look up current documentation and code examples for any library via Context7 |
| **kw-check-migrations-supabase** | Review and apply pending Supabase migrations with explanations |
| **kw-login-supabase-cli** | Set up Supabase CLI authentication and project linking |
| **kw-vite-checker-setup** | Configure vite-plugin-checker + vite-plugin-terminal for terminal error reporting |
| **kw-update-skills** | Update all external third-party skills |
| **kw-code-cleanup** | Add a code quality cleanup phase to a GSD milestone |

## Requirements

- [Claude Code](https://docs.anthropic.com/en/docs/claude-code) or any agent supported by the [skills CLI](https://skills.sh)
- Node.js 18+
