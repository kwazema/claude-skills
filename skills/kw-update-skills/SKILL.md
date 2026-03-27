---
name: kw-update-skills
description: >
  Update external third-party skills to their latest versions. Use when the user says
  "update skills", "actualizar skills", "actualiza las skills externas",
  "hay updates de skills", "check for skill updates", or wants to update installed skills.
---

# Update External Skills

Update all third-party skills installed via the `skills` CLI to their latest versions.

External skills are those installed from remote repositories with `npx skills add`. Locally authored skills (created manually in `~/.claude/skills/` or `.claude/skills/`) are not affected.

## Usage

Give the user the command:

```
! npx skills update
```

The command checks all installed skills against their source repositories and updates any that have newer versions available.

## If the update fails

- **Network error**: Check internet connection. The CLI needs to reach GitHub/GitLab.
- **Permission error**: Check write access to `~/.claude/skills/` (or the agent's skill directory).
- **Single skill fails**: Reinstall just that skill:
  ```bash
  npx skills add <owner/repo> --skill <name>
  ```

## Check what is installed

```bash
npx skills list
```

Shows all installed skills, their source repositories, and current versions.

## Important

- This only updates skills installed via `npx skills add` from remote repos.
- Skills you created locally or symlinked manually are not tracked and won't be affected.
- After updating, restart Claude Code for the new skill versions to take effect.
