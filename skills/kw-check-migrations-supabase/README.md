# kw-check-migrations-supabase

Review pending Supabase changes — database migrations and edge functions — explain each one, and deploy after confirmation.

## Install

```bash
npx skills add kwazema/claude-skills --skill kw-check-migrations-supabase
```

## What it does

### Database migrations
- Detects pending local migrations not yet applied to remote
- Reads and explains each SQL migration file in plain language
- Flags destructive operations (DROP, DELETE, TRUNCATE) with warnings
- Applies migrations only after explicit user confirmation

### Edge functions
- Detects local functions not yet deployed (new functions)
- Downloads remote versions and diffs against local code to find changed functions
- Shows a summary of what changed in each function
- Deploys selected functions one by one after confirmation

## Example

> "Check migrations", "Push migrations", "Deploy functions", "Check supabase"

Claude will check both migrations and edge functions, present a unified summary, and ask what you want to deploy.

## Triggers

`push migrations`, `check migrations`, `db push`, `aplicar migraciones`, `push migraciones`, `deploy functions`, `check edge functions`, `desplegar funciones`, `check supabase`

See [SKILL.md](./SKILL.md) for the full workflow.
