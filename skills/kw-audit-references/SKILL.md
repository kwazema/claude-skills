---
name: kw-audit-references
description: "Deep audit of .planning/reference/ + .planning/codebase/ docs, CLAUDE.md and PROJECT.md against current codebase and milestone changes. Manual-only — invoke when closing a milestone or when living docs may be stale. Generates REFERENCE-AUDIT-v{milestone}.md report."
---

# Audit References

Systematic audit of living documentation — both the hand-written `.planning/reference/` docs (lifecycle, business rules, integrations) and the GSD-generated `.planning/codebase/` analysis (architecture, structure, concerns, conventions). Reads milestone context, spawns parallel agents to analyze each document against current code, and produces a scored report with interactive Q&A.

## When to Use

Manual-only. Invoke explicitly with `/kw-audit-references`. The system will remind the user at milestone close, but never auto-execute.

## Arguments

- No args: audit `.planning/reference/` + `.planning/codebase/` docs + PROJECT.md + CLAUDE.md
- `--reference-only`: narrow scope — skip `.planning/codebase/` (the pre-existing behavior)
- `--full`: also audit phase artifacts (CONTEXT.md, PLAN.md) from the current milestone

## Workflow

### 1. Load milestone context

Read these files to understand what changed:
- `.planning/STATE.md` — completed phases, progress
- `.planning/ROADMAP.md` — what each phase covers
- For each completed phase in the current milestone, read its `*-SUMMARY.md` files

Build a changelog: new services, new transitions, changed integrations, new components, modified data model. This changelog is the lens through which every reference doc gets audited.

### 2. Inventory documents to audit

**Always audited:**
- All `.planning/reference/*.md` files — hand-written living docs (lifecycle, business rules, integrations, audit logs)
- All `.planning/codebase/*.md` files — GSD-generated analysis (ARCHITECTURE, STRUCTURE, CONVENTIONS, STACK, CONCERNS, INTEGRATIONS, TESTING). **Unless `--reference-only` is passed.** These describe the code directly, so the changelog often makes them drift first — e.g. a new edge function missing from STRUCTURE, a resolved item still listed in CONCERNS, a marker format changed in INTEGRATIONS.
- `PROJECT.md` (`.planning/PROJECT.md`)
- `CLAUDE.md` (repo root, if exists) — verify stack versions, commands, conventions match package.json, tsconfig, biome.json

**Relevance scoring (codebase docs especially).** Not every doc is equally exposed to a given milestone. Each agent must tag its document with a relevance level (`high` / `medium` / `low` / `none`) for *this* changelog and must NOT manufacture findings for low/none docs — confirming "still accurate, no change needed" is a valid, valuable result. Typical low-relevance unless the milestone touched them: `STACK.md` (only if deps/versions changed), `TESTING.md` (only if the validation strategy changed), `MULTI-INSTANCE-ARCHITECTURE.md` (only if deploy/isolation changed).

**With `--full` flag, also audit:**
- `*-CONTEXT.md` and `*-PLAN.md` from phases in the current milestone
- Focus: do they reference files/functions that still exist?

### 3. Spawn parallel analysis agents

Launch one agent per document (every `reference/` + `codebase/` doc plus PROJECT.md and CLAUDE.md). Each agent receives:
- The document to audit
- The milestone changelog from step 1
- Instructions from `references/agent-instructions.md`

Each agent performs two passes:

**Pass 1 — Textual analysis:**
- Grep for file paths mentioned in the doc — do they exist?
- Grep for function/hook/service names — do they exist with that signature?
- Search for "pending", "TODO", "Phase N+", "not yet implemented", "future" — cross-reference with STATE.md
- Check env vars, API endpoints, integration names against actual .env.example and code

**Pass 2 — Behavioral verification:**
- For each key claim in the doc ("function X does Y"), read the actual code and verify
- For state machines / lifecycle docs: verify transitions match actual service functions
- For spec docs (Sage, OCR): verify field mappings match actual adapter code
- For CLAUDE.md (repo): verify stack versions, commands, conventions match package.json, tsconfig, biome.json

Each agent returns structured findings per `references/finding-format.md`.

### 4. Parent agent synthesis

Collect findings from all agents. For each finding flagged as HIGH or MEDIUM:
- Read the referenced code directly to confirm the agent's assessment
- Discard false positives
- Group related findings (same root cause across multiple docs)

### 5. Generate report file

Write `.planning/REFERENCE-AUDIT-v{milestone}.md` per `references/report-template.md`.

Do NOT commit. The file stays unstaged for user review.

### 6. Present interactive summary in chat

Show concise summary:
- Documents audited: N
- Findings: N stale, N outdated, N broken refs, N opportunities
- Per-document one-liner

Then present findings that need user decisions, grouped by document. For each:
- What the doc says vs what the code shows
- Suggested fix
- Ask: fix / skip / discuss

After all decisions, apply approved fixes to the reference docs.

### 7. Optional: suggest follow-up

If findings are substantial (>5 fixes needed), suggest:
"This audit found enough issues for a cleanup phase. You can use the report as input for `/gsd:plan-phase` or `/kw-code-cleanup`."

## Key Principles

- **Milestone-aware.** The changelog drives the audit — without it, you're just grepping blindly.
- **Evidence-based.** Every finding includes file:line from both the doc and the code.
- **Non-destructive.** Never auto-fix. Present, ask, then fix.
- **Parallel but verified.** Agents do the heavy lifting, parent confirms critical findings.
- **Opportunities are separate.** Code improvement hints go in their own section, clearly marked as optional.

## References

- `references/agent-instructions.md` — Prompt template for parallel analysis agents
- `references/finding-format.md` — Structured format for agent findings
- `references/report-template.md` — Template for the REFERENCE-AUDIT output file
