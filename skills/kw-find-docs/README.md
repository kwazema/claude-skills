# kw-find-docs

Look up current documentation and code examples for any programming library using Context7.

## Install

```bash
npx skills add kwazema/claude-skills --skill kw-find-docs
```

## What it does

- Resolves library names to Context7 IDs for accurate doc retrieval
- Fetches up-to-date code snippets and API references
- Supports version-specific documentation lookups
- Works with any library indexed by Context7 (React, Next.js, Prisma, etc.)

## Example

> "How do I use the new React 19 use() hook?"

Claude will query Context7 for the latest React docs and return current code examples instead of relying on potentially outdated training data.

## Triggers

Activates automatically when writing code with external packages, verifying API signatures, or looking up usage patterns.

See [SKILL.md](./SKILL.md) for the full workflow.
