---
name: kw-gsd-fortify
description: >
  Fortify a GSD phase with deep codebase analysis before execution. Enriches CONTEXT.md
  and annotates PLAN.md files with actionable implementation guidance so the executor
  produces correct code on the first pass. Manual-only — invoke ONLY when the user
  explicitly says "fortify phase", "fortify", "fortificar fase", or "/kw-gsd-fortify".
  Never auto-trigger. Requires Get Shit Done (GSD) workflow.
---

# Fortify Phase

Deep codebase analysis that prepares a GSD phase for execution. Enriches CONTEXT.md with understanding and annotates PLAN.md files with actionable implementation guidance, so the executor produces correct code on the first pass.

## When to Use

After `/gsd:plan-phase` and before `/gsd:execute-phase`. Manual-only — only invoke when the user explicitly requests it.

Recommended flow:
```
/gsd:discuss-phase {X} → /gsd:plan-phase {X} → /kw-gsd-fortify {X} → /clear → /gsd:execute-phase {X}
```

## Arguments

Phase number (required). Example: `/kw-gsd-fortify 13.1`

## Modes

The skill detects which artifacts exist and adapts:

| CONTEXT.md | PLAN.md | Mode | What it does |
|:---:|:---:|---|---|
| Yes | Yes | **Full** | 4-agent deep analysis → enrich CONTEXT.md + annotate PLAN.md |
| Yes | No | **Pre-plan** | 2-agent context enrichment (data flow + patterns) |
| No | Yes | **Plan-only** | 4-agent analysis → create CONTEXT.md + annotate PLAN.md |
| No | No | **Error** | Stop — nothing to work with |

## Workflow

### 1. Load artifacts

Read the phase directory. Load CONTEXT.md and all PLAN.md files if they exist. Determine mode from the table above.

**Check for UI-SPEC.md:** Look for `{phase_num}-UI-SPEC.md` in the phase directory. If it exists, the UI Compliance Reviewer agent (Agent 5) will be spawned in step 2. If it doesn't exist, Agent 5 is skipped entirely.

**From PLAN.md files, extract:**
- `files_modified` from frontmatter of every plan
- `<files>` from each task
- `<action>` descriptions from each task
- `must_haves` from frontmatter
- `requirements` (REQ-IDs) from frontmatter

**From CONTEXT.md (if exists), extract:**
- `<decisions>` — LOCKED, do not modify
- `<domain>` — LOCKED, do not modify
- Key fields, tables, components, and concepts mentioned in decisions
- The reasoning behind each decision (each bullet is a user choice — understand WHY)
- Existing enrichment sections (enhance, don't duplicate)

### 2. Spawn research agents

#### Full mode and Plan-only mode — 4 agents in parallel

**Agent 1 — Cascade Impact Analyzer:**
Takes the complete list of `files_modified` from all plans. For each file:
- Find every file that imports or uses it (direct consumers)
- Find every file that imports a direct consumer (2nd-level cascade)
- Flag any file NOT in any plan's `files_modified` that will be affected
- For each flagged file, explain WHY it's affected and what could break

Output: cascade dependency map + list of unplanned affected files with impact explanation.

**Agent 2 — Implementation Pattern Scout:**
For each task's `<action>`, search the codebase for similar implementations already done:
- Find exact file:line where a similar pattern exists
- Extract the code snippet (2-5 lines) showing the established pattern
- Note whether the task should follow or deviate from the pattern, and why
- Check for anti-patterns to explicitly avoid

Output: per-task pattern references with code snippets.

**Agent 3 — Data Layer Analyst:**
Trace every database table and column mentioned or implied in the plans:
- RLS policies that affect those tables (check Supabase migrations)
- Type definitions in `integrations/supabase/types` that will need regeneration
- Hooks in `src/hooks/` that query those tables
- Services in `src/services/` that write to those tables
- Migration ordering: schema changes must happen before data operations
- Edge functions or external integrations that touch those tables

Output: data layer map + migration sequence + type regeneration checklist.

**Agent 4 — Risk & Edge Case Hunter:**
Based on ALL planned changes across ALL plans, identify:
- **State management:** React Query cache keys that need invalidation after mutations
- **TypeScript types:** Interfaces/types that need new fields or modified signatures
- **UI consistency:** Components displaying data whose shape will change
- **Null/undefined paths:** New optional fields without defaults, optional chaining gaps
- **Race conditions:** Concurrent mutations to same records, optimistic updates
- **Integration boundaries:** Supabase RLS enforcement, auth context requirements
- **Build impact:** Import chains that could break, circular dependency risks

Output: risk matrix with severity (high/medium/low), concrete description, and mitigation.

**Agent 5 — UI Compliance Reviewer (only when UI-SPEC.md exists):**
This agent is a **validator and question-asker**, not a designer. It never invents UI — it validates what's planned and asks the user when something is missing.

Takes the UI-SPEC.md and all PLAN.md files. For each task that touches UI components:

1. **Validate against UI-SPEC contract:**
   - Cross-reference planned components with the UI-SPEC's declared component approach (Visuals pillar)
   - Check that spacing, typography, and color decisions in UI-SPEC are reflected in the plan's task actions
   - Flag tasks that add UI elements not covered by the spec (missing contract)
   - Flag spec requirements that no task implements (missing coverage)

2. **Verify shadcn registry usage:**
   - For each component the plan intends to use, verify it exists in the shadcn registry
   - Check if the project already has it installed (search `components/ui/` for existing components)
   - If a plan references a shadcn component not yet installed, note it as a pre-execution dependency
   - Flag any planned custom component that could be replaced by an existing shadcn component

3. **Detect custom component needs — ASK, don't invent:**
   When the analysis reveals a UI need that shadcn base components cannot fulfill:
   - Do NOT propose a custom implementation
   - Instead, flag it as a **UI-QUESTION** for the user
   - The user may have access to component libraries and prefers to choose the component/block themselves
   - Format: describe WHAT is needed and WHY, then ask the user to provide the component code or npm package
   - The executor will then integrate the user-provided component respecting the project's `shadcn init` configuration

4. **Check component composition patterns:**
   - Verify that planned component hierarchies follow existing patterns in the codebase
   - Flag unusual nesting or prop-drilling that deviates from established patterns
   - Check for accessibility patterns already used in the project (aria attributes, keyboard navigation)

Output: UI compliance report with — spec coverage gaps, registry verification, custom component questions, pattern deviations.

#### Pre-plan mode — 2 agents in parallel

**Agent 1 — Data Flow Tracer:**
Find every place where the key fields (from `<decisions>`) are written, read, or calculated. Trace the full lifecycle: who creates the data, who transforms it, who displays it. Report exact file:line for each touchpoint.

**Agent 2 — Patterns, References & Risks:**
Combined search for:
- Related CONTEXT.md files from prior phases
- Reference docs in `.planning/reference/`
- Codebase maps in `.planning/codebase/`
- Decisions from prior phases that affect this one
- Hardcoded values, fallback chains, edge functions that could break
- Established patterns the implementation must follow

### 3. Present findings report

After agents complete, present a structured report to the user BEFORE writing anything.

#### 3a. Findings summary

Present a concise overview:
- **Cascade impact:** N files affected outside plans. List each with severity.
- **Pattern coverage:** N tasks have matching patterns in codebase, M tasks are novel (no precedent).
- **Data layer:** N tables involved, migration ordering needed yes/no, type regen needed yes/no.
- **Risks:** N high, M medium, P low.
- **UI compliance (only if Agent 5 ran):** N spec gaps, M registry issues, P custom component questions.

#### 3b. Flag gaps and inconsistencies

**CRITICAL:** If the analysis reveals issues, present them clearly with evidence. Categorize as:

**Gaps (something is missing from the plans):**
- "File `X.tsx` imports `Y.ts` and uses `functionZ()`. Plan 01 modifies `functionZ()`'s signature, but `X.tsx` is not in any plan's `files_modified`. This will break at runtime."

**Inconsistencies (plan says one thing, code says another):**
- "Plan 01 Task 2 action says 'modify `updateEmployee()` in `service.ts`', but the function is actually called `updateRecord()` at line 145."

**For each issue, state clearly:**
1. What was found (the evidence)
2. Why it matters (what breaks)
3. Suggested resolution (re-plan, add task, adjust action, or accept risk)

#### 3c. Ask questions

After presenting findings, ask targeted questions about anything that needs user input. Wait for user responses before proceeding.

If there are NO gaps, inconsistencies, or questions — say so explicitly.

#### 3d. Evaluate whether fortify adds value

Score each dimension (0-2):

| Dimension | 0 (no value) | 1 (some value) | 2 (high value) |
|---|---|---|---|
| **Cascade** | 0 unplanned files affected | 1-2 low-severity files | Any medium/high severity file |
| **Gaps** | 0 gaps found | 0 gaps, but useful context captured | 1+ gaps found and resolved |
| **Inconsistencies** | 0 inconsistencies | Minor naming/line discrepancies | Signature mismatches or wrong assumptions |
| **Risks** | 0 risks, or all already handled by plans | 1+ medium risks not in plans | 1+ high risks not in plans |
| **Patterns** | All tasks have patterns already in plan interfaces | Some tasks lack pattern refs | Novel tasks with no codebase precedent |
| **Data layer** | No DB involvement, or trivial queries | Joins/nullability worth documenting | Migrations needed, type regen, RLS gaps |
| **UI compliance** *(only if Agent 5 ran)* | All components exist in registry, spec fully covered | Minor spec gaps or missing installs | Custom components needed, spec coverage holes |

**Total score (0-12, or 0-14 if UI dimension applies):**

- **0-3 → SKIP (0-4 with UI):** Plans are well-specified. Fortify would be noise.
- **4-6 → PARTIAL (5-8 with UI):** Write only sections with real signal.
- **7-12 → FULL (9-14 with UI):** Full enrichment justified.

Ask the user for confirmation based on the verdict.

### 4. Enrich CONTEXT.md

Read `references/fortify-guide.md` for detailed section templates and examples.

**In Full mode and Plan-only mode**, add or enhance ALL of these sections:
- `<problem>` — Why this phase exists, business impact
- `<current_behavior>` — Full data flow with exact file:line
- Enhanced `<code_context>` — Integration points grouped by: "must change" / "auto-fixed" / "needs investigation"
- Enhanced `<specifics>` — Before/after examples with real numbers
- `<cascade_impact>` — Files affected outside plans
- `<implementation_patterns>` — Per-plan pattern references with code snippets
- `<data_layer_analysis>` — Tables, RLS, types, hooks, services, migration order
- `<risk_matrix>` — Risks by severity with descriptions and mitigations
- `<ui_compliance>` *(only when Agent 5 ran)* — UI-SPEC coverage analysis, shadcn registry status, custom component needs

**In Pre-plan mode**, add: `<problem>`, `<current_behavior>`, enhanced `<code_context>`, enhanced `<specifics>`.

**NEVER modify `<decisions>` or `<domain>`.** Those are user decisions — locked.

### 5. Annotate PLAN.md files

**Only in Full and Plan-only modes.** Append a `<fortify_notes>` block at the END of each PLAN.md, after all tasks. **NEVER modify existing tasks, frontmatter, or plan structure.**

The `<fortify_notes>` block contains per-task guidance: pattern to follow, cascade warnings, relevant risks, inter-plan coordination notes, and cross-plan dependencies.

Read `references/fortify-guide.md` for the detailed annotation format and decision table of what goes in CONTEXT.md vs PLAN.md.

#### `<fortify_notes_ui>` — UI-specific guidance (only when Agent 5 ran)

Append a separate `<fortify_notes_ui>` block AFTER `<fortify_notes>` (or as the only block if there are no technical notes for this plan). This keeps UI guidance visually distinct from technical implementation notes.

```markdown
<fortify_notes_ui>
## UI compliance notes (added by fortify)

### Spec coverage
- [UI-SPEC requirement] → covered by Task N
- [UI-SPEC requirement] → NOT covered by any task — GAP

### Component registry
- `Button`, `Card`, `Dialog` — already installed in `components/ui/`
- `DataTable` — in shadcn registry but NOT installed. Run `npx shadcn@latest add data-table` before execution.
- `Combobox` — NOT in shadcn base registry.

### Custom component needs (requires user input)
- **CC-1: [Component description]**
  Needed: [what the UI needs — e.g., "a multi-select dropdown with tag chips"]
  Why: [why shadcn base doesn't cover this — e.g., "shadcn Select is single-select only"]
  Used in: Task N — [task description]
  → Provide the component code or npm package you prefer. It will be integrated respecting your `shadcn init` config.

### Task-specific UI notes
- **Task N — [description]:** Follow spacing scale from UI-SPEC (`gap-4` between cards, `p-6` inside). Pattern in `src/components/similar/Component.tsx:85`.
- **Task M — [description]:** Color usage — UI-SPEC specifies `primary` for CTAs, `muted` for secondary actions. Don't use raw hex values.
</fortify_notes_ui>
```

**NEVER modify existing `<task>` blocks.** `<fortify_notes_ui>` is append-only, same as `<fortify_notes>`.

### 6. Report improvements

Present a clear summary of what was improved: sections added to CONTEXT.md, notes added to each PLAN.md, gaps resolved, and gaps still pending. If Agent 5 ran, include UI compliance summary: spec coverage, registry status, and custom components pending user input (CC-N items block execution).

### 7. Commit

```bash
git add "{phase_dir}/{phase_num}-CONTEXT.md"
git add "{phase_dir}/{phase_num}-*-PLAN.md"
git commit -m "docs({phase_num}): fortify phase with deep codebase analysis and plan annotations"
```

## Key Principles

- **Two targets, two purposes.** CONTEXT.md = understanding (WHY, WHAT IS). PLAN.md `<fortify_notes>` = action (HOW, WATCH OUT).
- **Interactive, not blind.** Never write without presenting findings first. Gaps and inconsistencies are presented to the user.
- **Plans are sacred.** Never modify existing tasks or frontmatter. Only append `<fortify_notes>` and `<fortify_notes_ui>`.
- **Decisions are sacred.** `<decisions>` and `<domain>` in CONTEXT.md are NEVER modified.
- **Exact references over vague pointers.** Every finding includes file:line.
- **No noise.** "This file exists" is noise. "This file does X at line Y, the plan changes its input — verify it still works" is signal.
- **Gaps are not failures.** Finding a gap is the whole point. A gap found here is a bug prevented later.

## References

- `references/fortify-guide.md` — Section templates, cascade analysis format, risk matrix format, plan annotation format, discovery checklists
