---
name: kw-vite-checker-setup
description: >
  Install vite-plugin-checker (TypeScript errors) and configure Vite 8's native
  server.forwardConsole (runtime errors) so all dev errors appear in the terminal.
  Falls back to vite-plugin-terminal for Vite < 8. Use when setting up a Vite
  project, adding error reporting to dev server, or when the user wants errors
  visible without opening browser devtools. Triggers: "vite checker",
  "install vite checker", "configurar vite checker", "errores en terminal",
  "vite error reporting", "forward console".
---

# Vite Checker Setup

Install and configure two complementary systems so **all errors** appear in the terminal during development:

- **`vite-plugin-checker`** — TypeScript compile-time errors (types, syntax).
- **`server.forwardConsole`** — Browser runtime errors (`console.*`, unhandled errors) via Vite 8 native support.

## When to use

- Setting up a new Vite + TypeScript project
- User wants TS errors in terminal during `dev`
- User complains about not seeing type errors until build
- User wants browser console output (runtime errors, logs) in the terminal
- Adding dev-time error reporting to an existing Vite project

## Pre-flight checks

Before making any changes, verify current state:

1. **Check Vite version** in `package.json` devDependencies to determine which approach to use:
   - **Vite >= 8**: use native `server.forwardConsole`
   - **Vite < 8**: use `vite-plugin-terminal` (legacy fallback)
2. **Check `package.json`** for `vite-plugin-checker` in devDependencies.
3. **Check `vite.config.ts`** for `import checker` and its entry in the plugins array, plus `forwardConsole` in server config (Vite 8+) or `import terminal` (Vite < 8).

If everything is already installed and configured, inform the user and skip all steps. Only install/configure what is missing.

If `vite-plugin-terminal` is installed but the project uses Vite 8+, suggest migrating:
```bash
npm uninstall vite-plugin-terminal
```
And remove its import and plugin entry from `vite.config.ts`.

## Steps

### 1. Install dependencies (skip already installed)

```bash
npm i -D vite-plugin-checker
```

If **Vite < 8**, also install:
```bash
npm i -D vite-plugin-terminal
```

### 2. Configure vite.config.ts

#### Vite 8+ (recommended)

Add `checker` to plugins and `forwardConsole` to server config. No need to wrap `defineConfig` in a callback — `checker` only runs in dev by design, and `forwardConsole` only activates during dev server.

```ts
import checker from "vite-plugin-checker";

export default defineConfig({
  plugins: [
    // ...existing plugins
    checker({ typescript: true }),
  ],
  server: {
    // ...existing server config
    forwardConsole: {
      unhandledErrors: true,
      logLevels: ["log", "warn", "error", "info"],
    },
  },
});
```

#### Vite < 8 (legacy fallback)

Convert `defineConfig` to callback form if needed, and use `vite-plugin-terminal`:

```ts
import checker from "vite-plugin-checker";
import terminal from "vite-plugin-terminal";

export default defineConfig(({ mode }) => ({
  plugins: [
    // ...existing plugins
    mode === "development" && checker({ typescript: true }),
    mode === "development" && terminal({ console: "terminal", output: ["terminal", "console"] }),
  ].filter(Boolean),
}));
```

### 3. Commit changes

Commit the modified files:

```bash
git add vite.config.ts package.json package-lock.json
git commit -m "chore(dev): add vite-plugin-checker and forwardConsole"
```

Only include files that were actually changed.

### 4. Verify

Run `npm run dev`. You should now see:
- **TypeScript errors** in the terminal (inline, real-time) and as a browser overlay
- **Runtime errors** and console output mirrored in the terminal

## Key details

- **checker** runs `tsc` in a **worker thread** — it does not block HMR or slow down the dev server.
- **forwardConsole** (Vite 8+) is a native Vite feature that forwards browser `console.*` calls and unhandled errors to the dev server terminal via WebSocket. No plugin needed.
- forwardConsole only activates during dev server — production builds are unaffected.
- forwardConsole default is auto-detected: `true` when an AI coding agent is detected, otherwise `false`. Explicit config overrides the detection.
- If the project also uses ESLint, checker supports `eslint: true` as an additional option.

## forwardConsole options reference (Vite 8+)

| Option             | Type                                         | Default                              | Description                                                    |
|--------------------|----------------------------------------------|--------------------------------------|----------------------------------------------------------------|
| `unhandledErrors`  | `boolean`                                    | `true` (when enabled)               | Forward uncaught exceptions and unhandled promise rejections   |
| `logLevels`        | `('error' \| 'warn' \| 'info' \| 'log' \| 'debug')[]` | `['error', 'warn']` (when enabled) | Which `console.*` calls are forwarded                          |

Shorthand: `forwardConsole: true` enables defaults (unhandled errors + error/warn logs).

## Vite version compatibility

| Vite version | Runtime errors approach   | TypeScript errors       |
|--------------|---------------------------|-------------------------|
| >= 8         | `server.forwardConsole` (native) | `vite-plugin-checker` |
| < 8          | `vite-plugin-terminal` (plugin)  | `vite-plugin-checker` |
