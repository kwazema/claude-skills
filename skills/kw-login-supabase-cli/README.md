# kw-login-supabase-cli

Set up Supabase CLI authentication and project linking in one go.

## Install

```bash
npx skills add kwazema/claude-skills --skill kw-login-supabase-cli
```

## What it does

- Authenticates with Supabase CLI (prompts browser login if needed)
- Initializes the `supabase/` directory structure if missing
- Links the project to the correct Supabase project ref
- Verifies `.gitignore` covers `supabase/.temp/`
- Shows a summary table of setup status

## Example

> "Login supabase" or "Link supabase"

Claude will walk through authentication, initialization, and linking automatically, only pausing when your input is needed.

## Triggers

`login supabase`, `connect supabase`, `setup supabase cli`, `link supabase`, `conectar supabase`, `configurar supabase cli`

See [SKILL.md](./SKILL.md) for the full workflow.
