---
name: kw-check-migrations-supabase
description: Review pending Supabase migrations, explain each one, and push to remote after user confirmation. Use when the user says "push migrations", "aplicar migraciones", "db push", "push migraciones", "check migrations", or wants to apply pending database migrations.
---

# Check Migrations Supabase

Review and apply pending Supabase migrations with explanation and confirmation.

## Workflow

### 1. Detect pending migrations

Run `npx supabase db push --dry-run` to list migrations not yet applied to the remote database. If the command is not available or fails, fall back to `npx supabase migration list` and compare local vs remote status.

If no pending migrations: report "No pending migrations" and stop.

### 2. Read and explain each migration

For each pending migration file in `supabase/migrations/`:

- Read the SQL file
- Provide a concise explanation: what it does, what table/column it affects, and why (use SQL comments in the file as context)
- Flag any potentially destructive operations (DROP, DELETE, TRUNCATE) with a warning

Present as a numbered list:

```
## Pending migrations ({count})

1. **{filename}** — {one-line summary}
   {2-3 sentence explanation of what it does and why}

2. **{filename}** — {one-line summary}
   {explanation}
```

### 3. Ask for confirmation

After presenting all migrations, ask:

```
---
These {count} migrations will be applied in order to the remote database.
Continue? (yes/no)
---
```

### 4. Apply migrations

On confirmation, run `npx supabase db push` and report the result.

If any migration fails, report which one failed and the error message.

## Important

- Never push without showing the user what will be applied first
- Always read the actual SQL files, not just filenames
- Destructive operations (DROP TABLE, DELETE FROM, TRUNCATE) deserve explicit warnings
- The command uses `npx supabase` since the CLI may not be installed globally
