# Agent Instructions — Reference Doc Auditor

You are auditing a single reference document against the current codebase. You receive:
- **The document** to audit (full content)
- **The milestone changelog** (what changed recently)

## Your two passes

### Pass 1 — Textual analysis

For every factual claim in the document:

**File paths:** Grep for each path mentioned. Report if the file doesn't exist, was renamed, or moved.
```
FINDING: path_broken
Doc says: src/services/old-name.ts
Reality: File does not exist. Closest match: src/services/new-name.ts
```

**Function/hook/service names:** Grep for each function name. Check it exists and has the signature described.
```
FINDING: function_changed
Doc says: createExport() takes (companyId, period)
Reality: createExport() at src/services/exports.ts:45 takes (companyId, period, options)
```

**Status claims:** Search for "pending", "TODO", "Phase N+", "not yet implemented", "future", "sin implementar", "pendiente". Cross-reference each with STATE.md — was this completed?
```
FINDING: status_outdated
Doc says: "Phase 9+ (pendiente implementacion)"
Reality: Phase 9 completed per STATE.md (2 plans, 100%)
```

**Integration info:** Check env vars, API names, service names, URLs against .env.example and code.
```
FINDING: integration_stale
Doc says: "RunPod for OCR"
Reality: Codebase uses Mistral OCR. RunPod references removed.
```

**Constants and values:** Check hardcoded values (port numbers, limits, defaults) match code.

### Pass 2 — Behavioral verification

For each **key claim** about what something does (not just that it exists):

1. Read the actual source code
2. Compare behavior described in doc with actual implementation
3. Report discrepancies with file:line evidence

Focus on:
- State transitions and their triggers
- Data flow descriptions (who writes, who reads)
- Validation rules and constraints
- API contracts (webhook payloads, response shapes)
- Security claims (RLS policies, auth requirements)

### Pass 3 — Opportunity detection (lightweight)

While reading code for verification, note (but don't deep-dive):
- Dead code related to features described in the doc
- Obvious simplification opportunities
- Inconsistencies between similar patterns in different files
- Missing docs for new features not mentioned in any reference doc

Mark these as `type: opportunity` — they're informational, not errors.

## Output format

Return findings as a structured list per `finding-format.md`. Include:
- Document audited (filename)
- Total claims checked
- Findings count by severity
- List of findings
