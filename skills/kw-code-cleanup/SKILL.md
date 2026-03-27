---
name: kw-code-cleanup
description: Add a code quality cleanup phase to the current GSD milestone. Use when the user says "code cleanup", "cleanup phase", "limpieza de codigo", "add cleanup phase", or wants to add lint/refactoring/quality checks as a milestone phase.
---

# Code Cleanup Phase

Adds a cleanup phase at the end of the current GSD milestone based on real diagnostics. This skill ONLY creates the phase — it does NOT execute it.

## Rules

- Always run diagnostics BEFORE proposing the phase.
- Scope to code touched in the current milestone, not the entire codebase.
- Always confirm with the user before creating the phase.

## Workflow

### Step 1: Detect context

Read these files in parallel:
- `.planning/STATE.md` — active milestone name and version
- `.planning/ROADMAP.md` — phase list and max phase number

Extract: milestone version (e.g., `v1.2`), milestone name, and the phase numbers belonging to it.

### Step 2: Run diagnostics

Run these commands in parallel:

```bash
npm run lint 2>&1
```

```bash
npm outdated 2>&1
```

Parse the results:
- **Lint**: count errors by rule (`no-explicit-any`, `exhaustive-deps`, `no-empty`, etc.) and total warnings
- **Outdated**: separate into safe updates (within semver range, "Wanted" column) vs major bumps ("Latest" column)

### Step 3: Present findings and propose phase

Show the user a summary like:

```
Milestone vX.Y — Diagnostics:
- Lint: N errors (breakdown by rule), M warnings
- Deps: N safe updates, M major (don't touch)

Proposed phase — Code Cleanup vX.Y:
[x] Fix lint errors in files touched during the milestone
[x] Type any in modified code
[x] Apply safe dependency updates (npm update)
[x] Fix exhaustive-deps in new/modified components
[x] Clean build as final validation
```

Adapt the checklist based on what the diagnostics actually found. If lint is clean, don't include lint tasks. If no safe dependency updates exist, skip that task.

Ask: "Confirm this phase? You can remove tasks that don't apply."

### Step 4: Create the phase

After user confirms, run:

```bash
node "$HOME/.claude/get-shit-done/bin/gsd-tools.cjs" phase add "Code Cleanup: technical cleanup vX.Y"
```

Replace `vX.Y` with the actual milestone version from Step 1.

The CLI will:
- Add the phase entry to `.planning/ROADMAP.md`
- Create the phase directory under `.planning/phases/`
- Return JSON with `phase_number`, `slug`, and `directory`

### Step 5: Confirm

Tell the user:
- Phase number and name that was added
- Remind them to plan it with `/gsd:plan-phase N` when feature phases are done
- Remind them it won't execute until they explicitly run `/gsd:execute-phase N`
