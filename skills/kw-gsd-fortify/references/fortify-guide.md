# Fortify Guide

Detailed templates and criteria for fortifying a GSD phase. Read this during steps 4-5 of the workflow.

---

## Part 1: CONTEXT.md Enrichment

These sections go into CONTEXT.md. They provide understanding — the WHY and WHAT IS.

### `<problem>` — The Why

Answers: "Why does this phase exist? What breaks today?"

Each bullet in `<decisions>` was a user choice during discuss-phase. Explain the PROBLEM that drove each choice — business impact, not just technical description.

```markdown
<problem>
## What [client/user] needs and why

[1-2 paragraphs: the real-world problem from the user/client perspective. Not technical — business impact. Reference the specific decisions and explain what drove them.]

This affects:
- [Impact 1 — what the user sees wrong]
- [Impact 2 — what calculations are off]
- [Impact 3 — downstream effects]

[Origin: where the request came from — feedback doc, meeting, bug report.]
</problem>
```

**Good:** "Users see incorrect totals because the system snapshots value X at creation time, but the upstream value changes monthly."
**Bad:** "Add field X to table Y and update the UI."

---

### `<current_behavior>` — How It Works Today

The most valuable section. Show the FULL data lifecycle:

1. **Data model** — Tables, columns, types, relationships
2. **Write path** — Every place that CREATES or UPDATES the key data, with exact file:line
3. **Read path** — Every place that READS or CALCULATES from the key data
4. **What breaks** — Why the current approach fails for the new requirement

```markdown
<current_behavior>
## How it works today

### Data model
[Tables and columns with types. Show relationships.]

### Write path

**Who writes [field]:**
1. **[Flow name]** (`file.ts:line`):
   `actual code snippet (1-2 lines)`
   → [What this does and why it matters]

2. **[Flow name]** (`file.ts:line`):
   ...

### Read path / consumers
[Every code path that reads the data. Group by: "uses snapshot" vs "calculates directly".]

### What breaks
[Why the current approach fails. Connect back to <problem>.]
</current_behavior>
```

**Key rule:** Include the actual code snippet (1-2 lines) for each touchpoint.

---

### Enhanced `<code_context>` — Integration Points

Group touchpoints by action required:

```markdown
### Must Change (direct modifications needed)
- `file.ts:92` — [What it does now] → [What it needs to do]. [Why.]

### Auto-Fixed (works correctly if upstream changes are done)
- `hook.tsx:55` — Reads from [source]. If source is correct, no changes needed.

### Needs Investigation
- `service.ts:161` — May need updates. [What's uncertain and why.]
```

---

### Enhanced `<specifics>` — Concrete Examples

Before/after with real numbers from the project domain:

```markdown
**Example:** [Scenario with concrete values]

| Dimension | Current | Expected | Delta |
|-----------|---------|----------|-------|
| [Case 1]  | [value] | [value]  | [diff]|
| [Case 2]  | [value] | [value]  | [diff]|
```

---

### `<cascade_impact>` — Cascade Impact Map

Shows files affected by planned changes that are NOT in any plan's `files_modified`.

```markdown
<cascade_impact>
## Cascade impact

### Files in plans (direct modification)
[List files_modified from all plans — for reference]

### Affected files NOT covered by plans

**[file.tsx]** — Imports `[modified_file]` and uses `[function/component]`.
  - Chain: `modified_file.ts` → `consumer.tsx` → `file.tsx`
  - Impact: [What breaks or needs updating]
  - Severity: [high/medium/low]

### Dependency map
[Simplified dependency tree showing the cascade chains]

### Assessment
[Are these cascade effects handled by the plans, or do they represent gaps?]
</cascade_impact>
```

**How to build the cascade map:**
1. Take `files_modified` from ALL plans
2. For each file, grep for imports: `from '.*filename'` or `import.*filename`
3. For each consumer found, check if it's in any plan's `files_modified`
4. If NOT → it's an unplanned cascade. Explain the impact.
5. Repeat one more level deep for critical files.

**Severity criteria:**
- Consumer directly uses a function/type/component that will change shape → **high**
- Consumer imports the file but only uses parts that won't change → **low**
- Consumer re-exports or wraps the changed functionality → **medium**

---

### `<implementation_patterns>` — Pattern References

Per-plan references to existing code patterns:

```markdown
<implementation_patterns>
## Existing implementation patterns

### Plan {X}-01: [Plan name]

**Task 1 — [task description]:**
Pattern in `src/services/similar-service.ts:45-60`:
```typescript
const result = await supabase.from('table').select('...').eq('field', value);
```
→ Follow this pattern. Note: uses `.single()` not `.maybeSingle()`.

### Anti-patterns to avoid
- [Pattern to avoid]: [Why it's wrong]. See `bad-example.ts:30`.
</implementation_patterns>
```

**Key rule:** Show the actual code snippet. The executor needs to SEE the pattern.

---

### `<data_layer_analysis>` — Data Layer Map

```markdown
<data_layer_analysis>
## Data layer analysis

### Affected tables

**[table_name]:**
- Relevant columns: `col1` (type), `col2` (type), ...
- RLS: [What policies exist, what roles can access]
- Writers: `service.ts:fn()` at line X
- Readers: `hook.ts:useXxx()` at line Y, `component.tsx` at line Z
- Relations: FK → `other_table.id`

### Migration order
1. First: [migration 1 — why it must go first]
2. Then: [migration 2 — depends on 1]

### Auto-generated types
- After migration, run `supabase gen types` to regenerate
- Manual type files in `src/types/` that mirror DB schema: [list any that need manual update]

### Hooks and services querying these tables
[List with query patterns — helps executor know what cache keys to invalidate]
</data_layer_analysis>
```

---

### `<risk_matrix>` — Risk Assessment

```markdown
<risk_matrix>
## Identified risks

### High
- **[Risk name]:** [Concrete description].
  - Where: `file.ts:line`
  - Mitigation: [What the executor should do]

### Medium
- **[Risk name]:** [Description].
  - Where: `file.ts:line`
  - Mitigation: [Prevention strategy]

### Low
- **[Risk name]:** [Description].
  - Where: `file.ts:line`
  - Mitigation: [Prevention strategy]
</risk_matrix>
```

**Severity criteria:**

| Severity | Criteria |
|----------|----------|
| **High** | Will cause runtime errors, data corruption, or broken UI if not addressed |
| **Medium** | Could cause subtle bugs under specific conditions |
| **Low** | Minor issues (TS warnings, suboptimal patterns, unlikely edge cases) |

**Common risks to check:**
- Cache invalidation: mutation in service X should invalidate query key Y
- Type narrowing: new optional field needs `?.` or default in N consumers
- RLS mismatch: frontend expects data that RLS blocks for certain roles
- Optimistic update: UI updates before server confirms — what if rejected?
- Import chain: new export creates circular dependency?
- Migration timing: frontend deployed before migration runs?

---

### `<ui_compliance>` — UI-SPEC Validation (only when Agent 5 ran)

Full UI analysis that goes into CONTEXT.md. The PLAN.md `<fortify_notes_ui>` will contain per-task summaries.

```markdown
<ui_compliance>
## UI validation against spec

### UI-SPEC coverage
| UI-SPEC requirement | Covered by | Status |
|---|---|---|
| [Spacing: gap-4 between cards] | Plan 01 Task 3 | OK |
| [Color: primary for CTAs] | Plan 01 Task 5 | OK |
| [Component: DataTable for list view] | — | GAP — no task implements this |

### shadcn registry status
| Component | In registry | Installed | Used in |
|---|---|---|---|
| Button | yes | yes (`components/ui/button.tsx`) | Task 1, 3, 5 |
| DataTable | yes | no | Task 4 — install before execution |
| [Custom multi-select] | no | no | Task 6 — requires user input |

### Custom components needed
**CC-1: [Descriptive name]**
- Needed: [concrete UI need — e.g., "a date range picker with presets"]
- Why: [why shadcn base doesn't cover it]
- UI-SPEC reference: [which section/requirement]
- Used in: Plan {X}-01, Task N
- Action: User will provide the component code or npm package. Will be integrated respecting the project's `shadcn init` config.

**CC-2: ...**

### Existing composition patterns
- Component nesting pattern: `src/components/dashboard/DashboardCard.tsx:15` — Card > CardHeader > CardTitle structure
- Form pattern: `src/components/forms/EmployeeForm.tsx:30` — useForm + zodResolver + FormField wrappers

### Detected deviations
- [Plan says "use a modal for editing" but UI-SPEC says "inline editing" — clarify]
- [Plan references `Tabs` component but UI-SPEC specifies sidebar navigation]
</ui_compliance>
```

**How to build UI compliance analysis:**
1. Read UI-SPEC.md completely — extract every component, spacing, color, and typography decision
2. For each UI-related task in PLANs, check if its action aligns with the spec
3. For each component mentioned, verify: exists in shadcn registry → installed in project → matches spec intent
4. When a gap is found between spec and plan, flag it — don't silently resolve
5. When a custom component is needed, describe the NEED, not the solution — the user decides the implementation

**When to flag as CC-N (custom component):**
- shadcn base registry has no matching component
- The need is clearly defined in UI-SPEC or implied by plan tasks
- A composition of base components would be overly complex or brittle
- The user should choose the source

**When NOT to flag:**
- A simple composition of 2-3 shadcn components covers the need
- The component exists in shadcn but is just not installed yet (that's a registry note, not CC)
- The "custom" need is actually just styling an existing component differently

---

## Part 2: PLAN.md Annotation

These notes go at the END of each PLAN.md as a `<fortify_notes>` block.

### `<fortify_notes>` — Implementation Guidance

```markdown
<fortify_notes>
## Implementation guidance (added by fortify)

### Task 1 — [task description from plan]
- **Pattern:** `src/services/similar.ts:45` — [1-line description].
  ```typescript
  // Key snippet showing the pattern
  const result = await supabase.from('table').select('*').eq('id', value);
  ```
- **Cascade:** After modifying `[file]`, check `[consumer:line]` — uses `[export]` directly.
- **Risk (high):** [Risk from matrix]. Mitigation: [specific action].

### Task 2 — [task description from plan]
- **Pattern:** No precedent in codebase. Closest: `[file:line]` — [how to adapt].
- **Inter-plan:** `[file]` is created by Plan {X}-01 Task 3. Available after wave 1.

### Cross-plan coordination
- Plan {X}-01 creates `[service]` → Plan {X}-02 Task 1 imports it. Wave order handles this.
- **Warning:** Plan {X}-01 changes the return type of `[function]`. Plan {X}-02 consumes it.
</fortify_notes>
```

### What goes WHERE — Decision table

| Information type | CONTEXT.md section | PLAN.md `<fortify_notes>` |
|---|---|---|
| Business problem, user impact | `<problem>` | — |
| Current data flow, code lifecycle | `<current_behavior>` | — |
| Integration points (grouped) | `<code_context>` | — |
| Before/after examples | `<specifics>` | — |
| Full cascade dependency map | `<cascade_impact>` | Per-task cascade warnings |
| Complete pattern catalog | `<implementation_patterns>` | Per-task pattern + snippet |
| DB tables, RLS, migration order | `<data_layer_analysis>` | Per-task data layer notes |
| Full risk assessment | `<risk_matrix>` | Per-task relevant risks |
| Inter-plan dependencies | — | Cross-plan coordination |

| UI-SPEC coverage gaps, registry status | CONTEXT.md `<ui_compliance>` | — |
| Per-task spacing/color/component notes | — | PLAN.md `<fortify_notes_ui>` |
| Custom component requests (CC-N) | — | PLAN.md `<fortify_notes_ui>` |

**Rule of thumb:** If the executor needs to UNDERSTAND it → CONTEXT.md. If the executor needs to ACT on it → PLAN.md `<fortify_notes>`. UI-specific action items → `<fortify_notes_ui>`.

### `<fortify_notes_ui>` — UI Implementation Guidance (only when Agent 5 ran)

Appended AFTER `<fortify_notes>` in each PLAN.md. Separate block for visual distinction.

```markdown
<fortify_notes_ui>
## UI compliance notes (added by fortify)

### Spec coverage for this plan
- Task 1 implements [UI-SPEC requirement] — use `gap-4` between items per spec
- Task 3 implements [UI-SPEC requirement] — follow color palette: `primary` for CTA, `muted` for secondary

### Pre-execution dependencies
- Install `data-table`: `npx shadcn@latest add data-table`
- Install `combobox`: `npx shadcn@latest add combobox`

### Custom component needs (requires user input)
- **CC-1: [Name]** — needed for Task N.
  Needed: [description of what the UI needs]
  → Provide the component code or npm package. Will be integrated respecting `shadcn init` config.

### Task-specific UI guidance
- **Task 1 — [description]:**
  - Component: Use `Card` with `CardHeader` + `CardContent`. Pattern: `src/components/dashboard/Widget.tsx:20`
  - Spacing: `p-6` inside card, `gap-4` between cards (from UI-SPEC)
  - Accessibility: Follow existing `aria-label` pattern in `Widget.tsx:35`

- **Task 3 — [description]:**
  - Color: UI-SPEC says `destructive` variant for delete actions. Don't use custom red.
  - Typography: `text-sm font-medium` for labels (existing pattern in forms)
</fortify_notes_ui>
```

**Key rules for `<fortify_notes_ui>`:**
- Custom component needs (CC-N) are the most critical output — the user MUST provide input before execution
- Always reference the UI-SPEC section that drives each note
- Include existing codebase patterns (file:line) so the executor follows established conventions
- Never propose custom component implementations — describe the need, let the user choose the source

### Annotation rules

1. **NEVER modify existing content** — don't touch tasks, frontmatter, or existing text
2. **Append only** — `<fortify_notes>` goes after the last `</task>` tag
3. **Reference tasks by description** — "Task 1 — [description]" so the executor can match
4. **Keep notes actionable** — not "this is interesting" but "do this because of that"
5. **Include code snippets** — patterns are useless without actual code
6. **Flag cross-plan dependencies** — each executor only sees ONE plan

---

## Part 3: Interactive Validation

### Gap format

```
**GAP-1: [Short title]**
- What: [What's missing]
- Evidence: `[file:line]` imports `[modified_file]` and uses `[function]`. Plan modifies `[function]` but `[file]` is not in any plan.
- Impact: [What breaks — high/medium/low]
- Options:
  a) Add task to Plan {X}-02 to update `[file]`
  b) Accept risk — `[file]` can tolerate the change because [reason]
  c) Re-plan — this gap changes the plan structure significantly
```

### Inconsistency format

```
**INC-1: [Short title]**
- Plan says: "[quote from plan action]"
- Code says: `[file:line]` — [what actually exists]
- Impact: Executor will [fail/produce wrong result] because [reason]
- Fix: [What needs to change]
```

---

## Discovery Checklists

### Cascade Impact
- [ ] Every importer of each file in `files_modified`
- [ ] Second-level importers for critical files
- [ ] Re-exports that propagate changes further
- [ ] Dynamic imports or lazy-loaded routes

### Implementation Patterns
- [ ] Similar features already implemented
- [ ] Service layer patterns (query structure, error handling, return types)
- [ ] Hook patterns (query keys, stale time, invalidation)
- [ ] Component patterns (loading states, error boundaries, empty states)
- [ ] Form patterns (validation schema, field structure, submit handler)

### Data Layer
- [ ] Every table/column mentioned or implied
- [ ] RLS policies on affected tables
- [ ] Type definitions that mirror DB schema
- [ ] Hooks with query keys for affected tables
- [ ] Services with mutations for affected tables
- [ ] Edge functions or external integrations

### UI Compliance (only when UI-SPEC.md exists)
- [ ] Every UI-SPEC requirement mapped to at least one plan task
- [ ] Every shadcn component referenced in plans exists in the registry
- [ ] Every shadcn component needed is installed in `components/ui/`
- [ ] Spacing tokens in plan actions match UI-SPEC scale
- [ ] Color usage in plan actions follows UI-SPEC palette (60/30/10 rule)
- [ ] Typography in plan actions follows UI-SPEC font scale
- [ ] Component composition follows existing codebase patterns
- [ ] Custom component needs identified and flagged as CC-N for user input
- [ ] No plan task invents a custom component — all custom needs go through the user
- [ ] Accessibility patterns from existing components are noted for new components

### Risks
- [ ] React Query cache keys needing invalidation
- [ ] TypeScript interfaces needing new/changed fields
- [ ] Components rendering data whose shape changes
- [ ] New optional fields without defaults
- [ ] Concurrent mutation scenarios
- [ ] Auth/role requirements for new functionality
- [ ] Build-time impacts (new deps, changed exports)

---

## Anti-Patterns

**Don't add (UI-specific):**
- Custom component implementations — the user chooses the source, not the agent
- "Use shadcn X instead of Y" without checking the UI-SPEC first — the spec is the authority
- Generic accessibility advice not grounded in the project's existing patterns

**Don't add:**
- File listings without explanation
- Generic architecture descriptions
- Speculative concerns without code evidence
- Duplicate content from `<decisions>`
- Implementation proposals that contradict the plan
- Theoretical risks not grounded in actual code
- Silent changes

**Do add:**
- Every concrete cascade chain
- Actual code snippets showing patterns to follow
- Real data examples showing what "correct" looks like
- Specific file:line references for every finding
- Business context for impact understanding
- Questions when something is ambiguous
- Clear per-task guidance in `<fortify_notes>`
- CC-N flags for every custom component need — with clear description of WHAT and WHY
- Per-task UI notes in `<fortify_notes_ui>` referencing UI-SPEC sections and existing patterns
- Pre-execution shadcn install commands for components not yet in the project
