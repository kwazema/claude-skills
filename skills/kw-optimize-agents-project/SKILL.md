---
name: kw-optimize-agents-project
description: "Optimize AGENTS.md/CLAUDE.md for minimal context footprint. Moves verbose sections to .planning/reference/ or .planning/codebase/, creates missing reference docs with templates, and ensures the project instructions file loads only what every conversation needs. Manual-only."
---

# Optimize Agents Project

Refactor the project's AGENTS.md (or CLAUDE.md) to minimize context window usage while preserving all information. Verbose sections move to reference docs loaded on demand. Missing reference infrastructure gets scaffolded with templates.

## When to Use

Manual-only. Invoke with `/kw-optimize-agents-project`. Useful when:
- AGENTS.md exceeds ~150 lines
- Auto-generated sections (GSD map-codebase, etc.) bloat the file
- Starting a new project and wanting a clean structure from the start
- After a major refactor that changed project architecture

## Workflow

### 1. Analyze current state

Read the project's AGENTS.md (or CLAUDE.md if AGENTS.md doesn't exist). Measure:
- Total lines and estimated tokens
- Identify each section and classify as:
  - **Essential** — must stay inline (project description, constraints, commands, strict rules)
  - **Redundant** — duplicates info from package.json, tsconfig, biome.json, or other config files the LLM can read
  - **Movable** — valuable but not needed in every conversation (detailed stack, conventions catalog, architecture layers)
  - **Auto-generated** — GSD markers (`<!-- GSD:xxx-start -->`) that duplicate `.planning/codebase/` files
- Check for existing reference infrastructure:
  - `.planning/reference/` — does it exist? what docs are in it?
  - `.planning/codebase/` — does it exist? (source for auto-generated sections)

### 2. Check reference infrastructure

Inventory what exists and what's missing:

| Path | Purpose | Exists? |
|------|---------|---------|
| `.planning/reference/` | Living reference docs | check |
| `.planning/codebase/` | GSD codebase analysis | check |
| `.planning/PROJECT.md` | Project definition | check |
| `.planning/STATE.md` | Current project state | check |

### 3. Present analysis

Show the user:
- Current line count and estimated token cost
- Per-section breakdown: what stays, what moves, what gets created
- Target line count after optimization
- List of reference docs that will be created (with one-line description of each)

Ask for confirmation before proceeding.

### 4. Create missing reference infrastructure

If `.planning/reference/` doesn't exist, create it. For each missing reference doc that would receive content from AGENTS.md, create it from templates in `references/templates/`.

Read `references/scaffolding-guide.md` for the full list of templates and when to create each one.

Key templates:
- `SYSTEM-MAP.md` — architecture, data flow, integrations, routes (create when architecture sections are being moved)
- `CODEBASE-CONVENTIONS.md` — naming patterns, code style, import organization (create when convention sections are being moved)
- `STACK-DETAIL.md` — full dependency list with versions (create when stack sections are being moved)

Each template includes:
- Section headings with `TODO:` placeholders
- Brief guide explaining what should go in each section
- Example content showing the expected level of detail

### 5. Refactor AGENTS.md

Apply the approved changes:

**Remove auto-generated GSD sections:**
- Delete content AND markers for `GSD:stack`, `GSD:conventions`, `GSD:architecture`
- Keep `GSD:profile` markers (managed by separate GSD command)
- If `GSD:project` has content not in the manual section (like Constraints), integrate it manually first, then remove

**Move verbose manual sections:**
- Extract detailed content to the appropriate reference doc
- Replace with a one-line pointer in the "Documentación de referencia" section

**Add reference pointers:**
- Ensure AGENTS.md has a "Documentación de referencia" section listing all reference docs with when-to-read guidance
- Include pointers to both `.planning/reference/` and `.planning/codebase/` if they exist

**Preserve:**
- Project description, core value, constraints
- Stack summary (one line, not per-dependency)
- Commands
- Strict rules (TypeScript strict, Biome, error handling patterns)
- Integrations summary
- Data model summary
- Business logic rules
- GSD workflow instructions
- Developer profile markers

### 6. Verify result

- Count final lines (target: <150)
- Verify no information was lost (everything either stays inline or has a reference doc)
- Verify reference pointers are correct paths
- Show before/after comparison to the user

### 7. Suggest next steps

Based on what was created:
- If templates were scaffolded with TODOs: "Run `/gsd:map-codebase` to fill the codebase analysis, or fill the reference docs manually over time."
- If AGENTS.md had stale info: "Consider running `/kw-audit-references` to verify reference docs are current."

Do NOT commit. Let the user review and commit when ready.

## Key Principles

- **Never lose information.** Every line removed from AGENTS.md must exist somewhere else (reference doc, codebase/ file, or inferable from code).
- **Templates over empty files.** Created reference docs have structure and guidance, not just empty markdown.
- **Conservative inline.** When in doubt, keep it inline. It's easier to move out later than to realize something was missing.
- **Project-scoped.** Only touches the current project's AGENTS.md. Never modifies `~/.codex/AGENTS.md`.

## References

- `references/scaffolding-guide.md` — Full template list, creation criteria, and content guide
