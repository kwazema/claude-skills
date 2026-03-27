# kw-check-migrations-supabase

Review pending Supabase migrations, explain each one, and push to the remote database after confirmation.

## Install

```bash
npx skills add kwazema/claude-skills --skill kw-check-migrations-supabase
```

## What it does

- Detects pending local migrations not yet applied to remote
- Reads and explains each SQL migration file in plain language
- Flags destructive operations (DROP, DELETE, TRUNCATE) with warnings
- Applies migrations only after explicit user confirmation

## Example

> "Check migrations" or "Push migrations"

Claude will list all pending migrations with explanations, warn about destructive operations, and ask for confirmation before pushing.

## Triggers

`push migrations`, `check migrations`, `db push`, `aplicar migraciones`, `push migraciones`

See [SKILL.md](./SKILL.md) for the full workflow.
