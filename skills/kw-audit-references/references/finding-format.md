# Finding Format

Each agent returns findings in this structure. The parent agent uses this to synthesize the final report.

## Finding object

```
FINDING: {id}
type: stale | outdated | broken_ref | inconsistency | opportunity
severity: high | medium | low
document: {filename}
section: {section heading where the claim appears}
claim: "{what the doc says — exact quote or paraphrase}"
reality: "{what the code shows — with file:line}"
evidence: {file}:{line} — {brief code snippet or ls output}
suggested_fix: "{concrete edit to make the doc accurate}"
```

## Severity criteria

| Severity | Criteria |
|----------|----------|
| **high** | Doc actively misleads — function doesn't exist, path broken, feature marked pending but shipped, wrong integration name. A future LLM session would produce incorrect code. |
| **medium** | Doc is imprecise — signature changed, field added, behavior slightly different. Future session would work but with friction. |
| **low** | Doc is technically correct but could be clearer — naming inconsistency, missing detail, stale comment. |

## Type definitions

| Type | Meaning |
|------|---------|
| `stale` | Doc describes something that has changed in the codebase |
| `outdated` | Doc says "pending/future" for something already implemented |
| `broken_ref` | Doc references a file path that doesn't exist |
| `inconsistency` | Two docs contradict each other about the same thing |
| `opportunity` | Not an error — a code improvement detected during verification |

## Agent output structure

```markdown
# Audit: {document_filename}

## Summary
- Claims checked: N
- Findings: N high, N medium, N low, N opportunities
- Verdict: STALE / MOSTLY_CURRENT / UP_TO_DATE

## Findings

FINDING: sm-01
type: outdated
severity: high
document: INVOICE-STATE-MACHINE.md
section: 1.3 Tabla de transiciones
claim: "T10 — Phase 9+ (pendiente implementacion)"
reality: Phase 9 completed. createExport() implements this at src/services/exports.ts:45
evidence: src/services/exports.ts:45 — export async function createExport(...)
suggested_fix: Update T10 row to reference createExport() and mark as implemented

FINDING: sm-02
...

## Opportunities

FINDING: sm-opp-01
type: opportunity
severity: low
document: INVOICE-STATE-MACHINE.md
section: 7. Mapa de servicios
claim: n/a
reality: src/services/exports.ts exports 3 new functions not listed in the services map
evidence: src/services/exports.ts — downloadExport(), getExportHistory(), redownloadExport()
suggested_fix: Add missing functions to the services map table
```
