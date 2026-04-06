---
name: kw-check-migrations-supabase
description: Review pending Supabase changes (migrations + edge functions), explain each one, and deploy after user confirmation. Use when the user says "push migrations", "aplicar migraciones", "db push", "push migraciones", "check migrations", "deploy functions", "check edge functions", "desplegar funciones", "check supabase", or wants to apply pending database migrations or deploy edge functions.
---

# Check Migrations & Edge Functions — Supabase

Review and apply pending Supabase migrations and deploy edge functions with explanation and confirmation.

## Workflow

Run both checks in sequence, then present a unified summary.

---

### Part A — Database Migrations

#### A1. Detect pending migrations

Run `npx supabase db push --dry-run` to list migrations not yet applied to the remote database. If it fails, fall back to `npx supabase migration list` and compare local vs remote status.

If no pending migrations, note it and move to Part B.

#### A2. Read and explain each migration

For each pending migration file in `supabase/migrations/`:

- Read the SQL file
- Provide a concise explanation: what it does, what table/column it affects, and why (use SQL comments as context)
- Flag any destructive operations (DROP, DELETE, TRUNCATE) with a warning

#### A3. Present migrations

```
## Pending migrations ({count})

1. **{filename}** — {one-line summary}
   {2-3 sentence explanation}

2. **{filename}** — {one-line summary}
   {explanation}
```

---

### Part B — Edge Functions

#### B1. Check if edge functions exist locally

Check if `supabase/functions/` exists and contains function directories. If the directory does not exist or is empty, note "No local edge functions" and skip to the summary.

#### B2. Compare local vs remote

1. Run `npx supabase functions list` to get deployed functions.
2. For each local function directory in `supabase/functions/`:
   - If it does NOT appear in the remote list → mark as **new** (pending first deploy).
   - If it appears in the remote list → download and diff (see B3).
3. For functions that appear only in remote (not local) → mention as info ("deployed but no local source").

#### B3. Diff existing functions

For each function that exists both locally and remotely:

1. Download the remote version to a temp directory: `npx supabase functions download <name> --output /tmp/supabase-fn-diff/<name>`
2. Diff the local directory against the downloaded version: `diff -rq supabase/functions/<name> /tmp/supabase-fn-diff/<name>`
3. Classify:
   - **Changed**: diff found differences → mark as pending deploy, show a summary of what changed
   - **Up to date**: no differences → mark as synced
4. Clean up the temp directory after all comparisons.

#### B4. Present edge functions

```
## Edge functions ({counts})

### New (not yet deployed)
- **{name}** — {brief description from index.ts}

### Changed (local differs from remote)
- **{name}** — {summary of changes}

### Up to date
- {name}, {name}

### Remote only (no local source)
- {name}
```

Omit any section that has zero items.

---

### Part C — Summary & Confirmation

Present a unified summary:

```
## Summary

- Migrations: {count} pending
- Edge functions: {new_count} new, {changed_count} changed

{If nothing pending in either category: "Everything is up to date." → stop}
```

Then ask what to deploy:

```
---
What would you like to deploy?
1. Migrations only
2. Edge functions only
3. Everything
4. Cancel
---
```

### Part D — Deploy

Based on user selection:

- **Migrations**: run `npx supabase db push` and report result. If any migration fails, report which one and the error.
- **Edge functions**: deploy each selected function one by one with `npx supabase functions deploy <name>` and report success/failure for each.

Report final status when done.

## Important

- Never deploy without showing the user what will be applied first
- Always read actual SQL files, not just filenames
- Destructive SQL operations (DROP TABLE, DELETE FROM, TRUNCATE) deserve explicit warnings
- For edge function diffs, always clean up temp files after comparison
- The commands use `npx supabase` since the CLI may not be installed globally
- If `supabase functions download` fails for a function, report it as "unable to diff" rather than failing the whole check
