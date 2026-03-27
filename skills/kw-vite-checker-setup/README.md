# kw-vite-checker-setup

Configure vite-plugin-checker and vite-plugin-terminal so all dev errors (TypeScript + runtime) appear in your terminal.

## Install

```bash
npx skills add kwazema/claude-skills --skill kw-vite-checker-setup
```

## What it does

- Installs `vite-plugin-checker` for real-time TypeScript errors in terminal
- Installs `vite-plugin-terminal` to mirror browser console output to terminal
- Configures both plugins in `vite.config.ts` (dev mode only)
- Skips already-installed plugins automatically

## Example

> "Set up vite checker" or "I want to see TS errors in the terminal"

Claude will check what's already configured, install only what's missing, and update your Vite config.

## Triggers

`vite checker`, `install vite checker`, `vite error reporting`, `configurar vite checker`, `errores en terminal`

See [SKILL.md](./SKILL.md) for the full workflow.
