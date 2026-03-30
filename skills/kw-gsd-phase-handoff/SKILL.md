---
name: kw-gsd-phase-handoff
description: Prepare a clean chat for a subsequent `gsd-execute-phase` by rebuilding GSD phase context safely first. Use when the user says "gsd phase handoff", "te voy a pasar el execute", "before execute-phase", "human in the loop", or wants to continue a phase from a fresh chat before invoking `gsd-execute-phase`. Read the handoff context first, surface only material doubts, inconsistencies, or out-of-scope improvements, and ask targeted questions before execution continues.
argument-hint: [upcoming gsd-execute-phase request, phase number, or handoff context]
---

# GSD Phase Handoff

Use this skill when the user is about to invoke `gsd-execute-phase` in a clean chat and wants you to rebuild the phase context first.

## Goal

Rebuild enough context to let `gsd-execute-phase` start from a reliable understanding instead of guessing from a cold chat.

## What to do

1. Read the user's handoff message completely before proposing actions.
2. Expect a subsequent `gsd-execute-phase` request. Treat this skill as a pre-execution handoff, not as execution itself.
3. Infer the phase number if possible. If the phase number is known and the repo has `.planning/`, read the relevant artifacts:
   - `.planning/STATE.md`
   - `{phase}-CONTEXT.md`
   - all `{phase}-*-PLAN.md`
   - `{phase}-UI-SPEC.md` if it exists
   - other phase files only if they resolve a real ambiguity
4. Build a compact mental model:
   - what is already decided
   - what is in scope now
   - what is blocked, deferred, or still missing
5. Apply human-in-the-loop gates. Pause and ask only when one of these is true:
   - the pasted context conflicts with repo artifacts
   - a technical decision is still open and would change the result
   - the upcoming `gsd-execute-phase` request skips a required GSD artifact or phase step
   - a high-impact improvement exists but would expand scope
   - critical context is missing and guessing would be risky
6. If none of those gates trigger, confirm the handoff briefly and say that the phase is ready for `gsd-execute-phase`.

## Questioning rules

- Ask only targeted questions that unblock the next action.
- Do not re-open decisions that are already locked in GSD artifacts unless there is a clear contradiction.
- Do not turn minor preferences into blockers.
- If `UI-SPEC.md` does not exist for that phase, treat it as optional unless the phase clearly depends on UI design.

## Output shape

Respond in this order:

1. Short understanding of the phase and the requested next action.
2. Material questions or inconsistencies, only if they exist.
3. If the context is coherent, say that the handoff is clear and you are ready for `gsd-execute-phase`.

## Routing

- If the user wants structured clarification before planning, prefer `gsd-discuss-phase`.
- If the user wants assumptions surfaced before planning, prefer `gsd-list-phase-assumptions`.
- If the handoff is clear and the user proceeds with execution, continue with `gsd-execute-phase`.
