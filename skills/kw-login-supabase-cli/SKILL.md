---
name: kw-login-supabase-cli
description: >
  Set up Supabase CLI authentication and project linking. Use when the user says
  "login supabase", "connect supabase", "setup supabase cli", "link supabase",
  "conectar supabase", "configurar supabase cli", or needs to authenticate with Supabase CLI.
---

# Login Supabase CLI

Authenticate with Supabase CLI and link a project. Execute ALL steps automatically. Only pause when user input is truly needed.

**RULES**:
- NEVER write tokens, secrets, or private keys to `.env` or any file.
- NEVER add `.env` to `.gitignore`. The `.env` only contains public/publishable keys and should be committed.
- NEVER read `.env` — it's not needed for CLI setup.
- CLI auth is always via `npx supabase login` in the user's terminal. Never use `--token-stdin` or paste tokens.

## Workflow — Execute all steps sequentially

### Step 1: Authenticate

Run `npx supabase projects list` to test auth.

**If it works**: Show the project list and ask: "Is this the correct Supabase account for this project?" Options:
- "Yes" → continue to Step 2
- "No, different account" → tell user to run `npx supabase login` in their terminal, wait for confirmation, then re-verify

**If it fails**: Tell the user to run `npx supabase login` in their terminal. Wait for confirmation, then re-verify with `npx supabase projects list`.

### Step 2: Initialize project

Check if `supabase/config.toml` exists. If NOT, run `npx supabase init` to create the `supabase/` directory structure. Then continue.

### Step 3: Check if already linked

Check `supabase/.temp/project-ref` exists AND `supabase/config.toml` has `project_id`. If BOTH exist → skip to Step 5. Otherwise continue to Step 4.

### Step 4: Link project

Check `project_id` in `supabase/config.toml`. If found, confirm: "Detected project ref `<ref>`. Link this project?" Options:
- "Yes, link it" → proceed
- "No, use another" → ask for the correct ref

If no ref found, ask the user: "Your project ref is in the Supabase dashboard: Project Settings > General. It's a 20-character ID."

Then run: `npx supabase link --project-ref <ref>`

If the command warns about `major_version`, fix `supabase/config.toml` immediately — add or update `[db]` section with the version from the warning.

### Step 5: Verify .gitignore

Check if `supabase/.temp/` is in `.gitignore`. Add it ONLY if missing. Do NOT add `.env`, `.env.local`, or `.env.*.local`.

### Step 6: Confirm

Run `npx supabase projects list` to verify. Show a summary table:

| Step | Status |
|------|--------|
| Login with correct account | OK/FAIL |
| Project linked (`<ref>` — `<name>`) | OK/FAIL |
| .gitignore (`supabase/.temp/`) | OK/Already existed |

## Troubleshooting

- **Login hangs**: Firewall or proxy may block the browser callback. Try from a different terminal.
- **"project not found"**: Verify ref is 20 chars and the account has access.
- **Switch account**: `npx supabase login` again — overwrites the global token.
