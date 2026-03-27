---
name: kw-cubic
description: >
  Process cubic.ai code review analysis and apply only the changes that make sense
  according to the project's architecture. Invoke when the user pastes cubic.ai output.
  Triggers: "cubic", "cubic review", "cubic analysis", "review de cubic".
  Requires Get Shit Done (GSD) workflow.
argument-hint: [cubic.ai output]
disable-model-invocation: true
---

The user has pasted the following external code review analysis from cubic.ai:

<cubic-analysis>
$ARGUMENTS
</cubic-analysis>

Before executing anything, read all available files in `.planning/codebase/` and `.planning/ROADMAP.md`. If they don't exist, continue with available context.

Execute the skill `gsd:quick` passing the following task description, replacing [ANALYSIS] with the full content of <cubic-analysis>:

"I have a cubic.ai analysis (external, independent code review) of my latest PR. Review it in detail and apply only the changes that make sense according to the project knowledge you just read. Do not implement anything that contradicts the existing architecture, is cosmetic without real impact, or affects auto-generated files. Analyze each cubic.ai issue with your own judgment before acting. cubic.ai analysis: [ANALYSIS]"
