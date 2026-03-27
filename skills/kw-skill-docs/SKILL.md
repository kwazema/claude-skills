---
name: kw-skill-docs
description: >
  Generate a comprehensive document listing all installed skills (local and built-in)
  with their activation type, arguments, dependencies, and compatibility notes.
  Use when the user says "skill docs", "document skills", "list all skills",
  "documentar skills", "catalogo de skills". Run monthly or after installing new skills.
disable-model-invocation: true
---

# Skill Docs Generator

Generate a structured prompt with full documentation of all available skills in the Claude Code environment.

## Workflow

### Step 1: Scan local skills

List all directories in `~/.claude/skills/` and read each `SKILL.md` found. For skills with subdirectories (`rules/`, `references/`, `agents/`), list those files (don't read them fully, just register they exist).

### Step 2: Catalog built-in skills

The following skills are built-in to Claude Code (no local files). Document them from information available in the system prompt:

**General:** keybindings-help, simplify, loop, claude-api
**GSD:** All commands with the `gsd:` prefix listed in the system prompt
**Code review:** code-review:code-review
**n8n:** All commands with the `n8n-mcp-skills:` prefix listed in the system prompt

### Step 3: Classify each skill

For each skill (local or built-in), document:

1. **Name** and invocation command (`/name`)
2. **Activation type**: Auto (user-invocable: false), User-only (disable-model-invocation: true), User + Model (default)
3. **Description**: What it does and when to use it
4. **Arguments**: Whether it accepts positional arguments and which ones
5. **Rule files**: Whether it has rules/, references/, etc. subdirectories and what they contain
6. **Dependencies and compatibility**: Required framework, version, stack
7. **Status in current project**: Whether it applies to the open project and why

### Step 4: Detect incompatibilities

Compare rules between UI skills (shadcn, frontend-design, vercel-*) and document known conflicts. Check the global CLAUDE.md for existing precedence rules.

### Step 5: Generate the output prompt

Produce a Markdown code block containing a structured prompt that includes:

```
You are a technical documentor. Generate a professional .docx document with the following information about the user's Claude Code skills ecosystem.

The document must include:

1. TABLE OF CONTENTS with all sections
2. EXECUTIVE SUMMARY: Total skills, how many local vs built-in, how many active in current project
3. FULL CATALOG: For each skill, technical card with all fields from Step 3
4. COMPATIBILITY MATRIX: Table of skills vs supported frameworks/stacks
5. KNOWN CONFLICTS: Detected incompatibilities and configured precedence rules

Format: Professional, with tables, clear headings, and formatted code.

DATA:
[Insert all information collected in steps 1-4 here]
```

### Step 6: Deliver

Show the complete prompt in a code block so the user can copy and paste it into Claude (claude.ai) to generate the .docx.
