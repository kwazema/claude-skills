---
name: kw-vite-checker-setup
description: >
  Install and configure vite-plugin-checker (TypeScript errors) and vite-plugin-terminal
  (runtime errors) so all dev errors appear in the terminal. Use when setting up a Vite
  project, adding error reporting to dev server, or when the user wants errors visible
  without opening browser devtools. Triggers: "vite checker", "install vite checker",
  "configurar vite checker", "errores en terminal", "vite error reporting".
---

# Vite Checker Setup

Install and configure two complementary plugins so **all errors** appear in the terminal during development:

- **`vite-plugin-checker`** — TypeScript compile-time errors (types, syntax).
- **`vite-plugin-terminal`** — Browser runtime errors (`console.error`, `console.log`, etc.).

## When to use

- Setting up a new Vite + TypeScript project
- User wants TS errors in terminal during `dev`
- User complains about not seeing type errors until build
- User wants browser console output (runtime errors, logs) in the terminal
- Adding dev-time error reporting to an existing Vite project

## Pre-flight checks

Before making any changes, verify current state:

1. **Check `package.json`** for `vite-plugin-checker` and `vite-plugin-terminal` in devDependencies.
2. **Check `vite.config.ts`** for `import checker` / `import terminal` and their entries in the plugins array.

If both plugins are already installed and configured, inform the user and skip all steps. Only install/configure what is missing.

## Steps

### 1. Install dependencies (skip already installed)

```bash
npm i -D vite-plugin-checker vite-plugin-terminal
```

### 2. Configure vite.config.ts

Add imports and plugins. Only enable in development mode.

If `defineConfig` uses a static object, convert it to the callback form to access `mode`:

```ts
// Before
export default defineConfig({ ... })

// After
export default defineConfig(({ mode }) => ({ ... }))
```

Add imports and plugin entries:

```ts
import checker from "vite-plugin-checker";
import terminal from "vite-plugin-terminal";

// Inside plugins array:
plugins: [
  // ...existing plugins
  mode === 'development' && checker({ typescript: true }),
  mode === 'development' && terminal({ console: 'terminal', output: ['terminal', 'console'] }),
].filter(Boolean),
```

### 3. Commit changes

Commit the modified files:

```bash
git add vite.config.ts package.json package-lock.json
git commit -m "chore(dev): add vite-plugin-checker and vite-plugin-terminal"
```

Only include files that were actually changed (e.g., if only one plugin was added, `vite.config.ts` may be the only config change).

### 4. Verify

Run `npm run dev`. You should now see:
- **TypeScript errors** in the terminal (inline, real-time) and as a browser overlay
- **Runtime errors** (`console.error`, `console.log`, etc.) mirrored in the terminal

## Key details

- **checker** runs `tsc` in a **worker thread** — it does not block HMR or slow down the dev server.
- **terminal** intercepts `console.*` calls in the browser and forwards them to the Vite dev server via WebSocket.
- Both are guarded with `mode === 'development'` so production builds are unaffected. `vite-plugin-terminal` also strips its calls from production bundles by default (`strip: true`).
- The `.filter(Boolean)` pattern handles the conditional plugin entries (false values get filtered out).
- **Error serialization caveat**: `Error` objects have non-enumerable properties (`message`, `stack`), so they serialize as `{}` over WebSocket. When logging caught errors, use `err instanceof Error ? err.message : err` instead of passing the raw error object.
- If the project also uses ESLint, checker supports `eslint: true` as an additional option.

## terminal plugin options reference

| Option    | Default       | Description                                                    |
|-----------|---------------|----------------------------------------------------------------|
| `console` | `undefined`   | Set to `'terminal'` to redirect all `console.*` calls          |
| `output`  | `'terminal'`  | `'terminal'`, `'console'`, or `['terminal', 'console']` (both) |
| `strip`   | `true`        | Remove terminal calls from production bundles                  |
