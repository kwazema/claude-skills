# kw-optimize-agents-project

Optimize AGENTS.md/CLAUDE.md for minimal context footprint without losing information.

## What it does

1. Analyzes the project's AGENTS.md — classifies each section as essential, redundant, movable, or auto-generated
2. Checks existing reference infrastructure (`.planning/reference/`, `.planning/codebase/`)
3. Presents a before/after plan with line counts and token estimates
4. Scaffolds missing reference docs from templates (SYSTEM-MAP, CODEBASE-CONVENTIONS, STACK-DETAIL)
5. Moves verbose sections to reference docs, replaces with one-line pointers
6. Removes auto-generated GSD sections that duplicate `.planning/codebase/` files
7. Verifies no information was lost

## Triggers

Manual-only. Invoke with `/kw-optimize-agents-project`.

## When to use

- AGENTS.md exceeds ~150 lines
- Auto-generated GSD sections bloat the file
- Starting a new project and wanting clean structure
- After a major refactor that changed project architecture

## Output

- Refactored AGENTS.md (<150 lines target)
- Scaffolded reference docs in `.planning/reference/` with TODO templates
- No auto-commit — left for user review
