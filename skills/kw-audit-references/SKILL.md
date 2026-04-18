---
name: kw-audit-references
description: "Deep audit of .planning/reference/ docs and PROJECT.md against current codebase and milestone changes. Manual-only — invoke when closing a milestone or when reference docs may be stale. Generates REFERENCE-AUDIT-v{milestone}.md report."
---

# Audit References

Systematic audit of living reference documentation. Reads milestone context, spawns parallel agents to analyze each document against current code, and produces a scored report with interactive Q&A.

## When to Use

Manual-only. Invoke explicitly with `/kw-audit-references`. The system will remind the user at milestone close, but never auto-execute.

## Arguments

- No args: full audit of reference docs + PROJECT.md
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
- All `.planning/reference/*.md` files
- `PROJECT.md` (`.planning/PROJECT.md`)
- `CLAUDE.md` (repo root, if exists) — verify stack versions, commands, conventions match package.json, tsconfig, biome.json

**With `--full` flag, also audit:**
- `*-CONTEXT.md` and `*-PLAN.md` from phases in the current milestone
- Focus: do they reference files/functions that still exist?

### 3. Spawn parallel analysis agents

Launch one agent per reference document. Each agent receives:
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
