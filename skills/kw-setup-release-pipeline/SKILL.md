---
name: kw-setup-release-pipeline
description: "One-shot setup of a complete release automation pipeline for Vite + React projects — Release Please action, Conventional Commits via Commitlint + Husky, SemVer bumps, CHANGELOG.md, GitHub Releases, and VITE_APP_VERSION/COMMIT/BUILD_TIME injection at build time. Triggers: setup release pipeline, release please, conventional commits, semver automation, automate changelog, versionado automatico, configurar release, bump automatico."
---

# kw-setup-release-pipeline

Instala en un proyecto Vite + React el pipeline completo de release automation usado en Kontevo. Un único comando deja listo: validación de Conventional Commits local, bumps SemVer automáticos en cada merge a `main`, `CHANGELOG.md` generado, tags, GitHub Releases, y env vars `VITE_APP_*` disponibles en build para mostrar versión/commit/fecha en la UI.

Manual-only. Invocar con `/kw-setup-release-pipeline`. Aborta si el proyecto no es Vite + React.

## Cuándo usar

- Proyecto Vite + React nuevo o sin versionado automático.
- Quieres: commits convencionales validados localmente, bumps automáticos, CHANGELOG sin tocarlo a mano, GitHub Release por cada versión.
- Como one-shot — no pensado para reconfigurar, solo para primera instalación.

## Fuera de scope

- Next.js, Astro, Remix u otros frameworks (aborta).
- Monorepos / Release Please manifest multi-paquete.
- Pre-release channels (`beta`, `rc`), signing de commits, GPG.
- Modificaciones a workflows CI existentes.
- Montar automáticamente un badge de versión en la UI (se genera bajo demanda al final si el usuario lo pide — ver `references/version-badge-spec.md`).

## Workflow

### 1. Gate de stack

Lee `package.json`. Verifica:
- `vite` en `devDependencies` o `dependencies`.
- `react` en `dependencies`.

Si falta cualquiera, aborta con:
> Esta skill solo soporta Vite + React. Detectado: {stack detectado}. Para otros stacks, adapta los templates manualmente desde `.planning/reference/` del proyecto Kontevo o crea una skill equivalente.

### 2. Detección de estado actual

Comprueba qué ya existe. Reporta al usuario antes de escribir nada:

| Fichero | Estado |
|---|---|
| `release-please-config.json` | existe / no existe |
| `.release-please-manifest.json` | existe / no existe |
| `.github/workflows/release-please.yml` | existe / no existe |
| `commitlint.config.js` | existe / no existe |
| `.husky/commit-msg` | existe / no existe |
| `.gitmessage` | existe / no existe |
| `src/lib/app-version.ts` | existe / no existe |
| `vite.config.ts` tiene `define:` | sí / no |
| `package.json` → scripts `prepare` para husky | sí / no |
| Deps `@commitlint/cli`, `@commitlint/config-conventional`, `husky` | instaladas / faltan |

Si hay conflictos (ficheros ya existentes), pregunta con `AskUserQuestion`: sobrescribir / saltar / abortar, por grupo.

### 3. Preguntas mínimas

Usa `AskUserQuestion` (una sola pregunta multi-parte):

1. **Versión inicial**: `1.0.0` (recomendado para proyectos que van a producción) / `0.1.0` (proyecto en desarrollo inicial).
2. **Rama de release**: default `main`, permite override si el proyecto usa otra rama principal.

Nada más. El resto se autodetecta o es fijo.

### 4. Generación de ficheros rígidos

Copia desde `references/files/` aplicando sustituciones:

| Destino | Origen | Sustituciones |
|---|---|---|
| `release-please-config.json` | `files/release-please-config.json` | ninguna |
| `.release-please-manifest.json` | `files/release-please-manifest.json` | `{{INITIAL_VERSION}}` |
| `.github/workflows/release-please.yml` | `files/release-please-workflow.yml` | `{{RELEASE_BRANCH}}` |
| `commitlint.config.js` | `files/commitlint.config.js` | ninguna |
| `.husky/commit-msg` | `files/husky-commit-msg` | ninguna (chmod +x tras copiar en sistemas *nix) |
| `.gitmessage` | `files/gitmessage` | ninguna |
| `src/lib/app-version.ts` | `files/app-version.ts` | ninguna |

### 5. Merge en `vite.config.ts`

Lee el `vite.config.ts` existente. Inyecta:

1. Import de `package.json` si no existe: `import pkg from './package.json' with { type: 'json' };` (o `assert { type: 'json' }` si el proyecto usa Node <20).
2. Dentro del objeto pasado a `defineConfig()`, añade la propiedad `define:` con las tres env vars. Si ya hay `define:`, fusiona en lugar de duplicar.

Referencia exacta del bloque en `references/files/vite-config-define-snippet.ts`.

Si no detecta un `VERCEL_GIT_COMMIT_SHA` obvio en el proyecto (no hay `vercel.json`, no hay `.vercel/`), pregunta al usuario qué host de CI usa y sustituye por la env var equivalente:

- Vercel → `process.env.VERCEL_GIT_COMMIT_SHA`
- Netlify → `process.env.COMMIT_REF`
- Cloudflare Pages → `process.env.CF_PAGES_COMMIT_SHA`
- GitHub Actions → `process.env.GITHUB_SHA`
- Otro → pregunta al usuario.

### 6. Merge en `src/vite-env.d.ts`

Lee el `vite-env.d.ts` existente. Añade al `ImportMetaEnv` las tres props:

```ts
readonly VITE_APP_VERSION: string;
readonly VITE_APP_COMMIT: string;
readonly VITE_APP_BUILD_TIME: string;
```

Si no existe el fichero, créalo completo desde `references/files/vite-env-snippet.d.ts`.

### 7. Bump inicial del `package.json`

Actualiza `version` en `package.json` a la versión inicial elegida. Si ya es `0.0.0` o `0.0.1` típico de scaffold, sobrescribe sin preguntar. Si es distinto (p.ej. `0.3.2`), confirma con `AskUserQuestion` antes de sobrescribir.

### 8. Scripts de `package.json`

Añade (si no existen):

```json
"scripts": {
  "prepare": "husky"
}
```

Si ya hay `prepare`, fusiona el comando (`"existing && husky"` o deja al usuario decidir).

### 9. Instalar dependencias

Detecta el package manager leyendo lockfile (`pnpm-lock.yaml` → pnpm, `bun.lockb` → bun, `yarn.lock` → yarn, default → npm).

Instala como devDependencies:
- `@commitlint/cli`
- `@commitlint/config-conventional`
- `husky`

Ejecuta el comando correspondiente. Tras la instalación, corre `npx husky` (o `pnpm dlx husky`, etc.) para inicializar la carpeta `.husky/` si no existía.

### 10. Actualizar `CLAUDE.md` (si existe)

Lee `CLAUDE.md` en la raíz del repo. Si existe:

- Busca una sección `## Conventional Commits`.
- Si no existe, añade la sección completa desde `references/claude-md-snippet.md` al final del documento (o en un punto lógico si detectas un orden temático).
- Si ya existe, no la toques. Avisa al usuario: "Sección Conventional Commits ya presente en CLAUDE.md, no se ha modificado".

### 11. Checkpoint humano final

Imprime el bloque de `references/checkpoint.md` sustituyendo las variables:

- `{{OWNER}}` y `{{REPO}}`: derivar de `git remote get-url origin`. Si el remote no es GitHub, pedir al usuario los valores.
- `{{RELEASE_BRANCH}}`: la elegida en paso 3.
- `{{INITIAL_VERSION}}`: la elegida en paso 3.
- `{{WORKFLOW_PERMISSIONS_URL}}`: `https://github.com/{{OWNER}}/{{REPO}}/settings/actions`.

**Detente aquí.** No continúes a commits ni a nada más. El checkpoint es terminal.

### 12. (Opcional) Badge de versión

Si el usuario pide después "añade también un badge de versión" o similar, lee `references/version-badge-spec.md` y genera el componente adaptándolo al stack UI que detectes en el proyecto. No lo montes automáticamente: solo crea el fichero e indica al usuario dónde puede montarlo.

## Principios

- **Idempotente al máximo posible**. Detecta estado antes de escribir. Pregunta ante conflicto.
- **Pocas preguntas**. Solo lo que no se puede autodetectar: versión inicial y rama.
- **Templates rígidos para lo universal**, LLM para lo que depende del stack (vite.config merge, badge UI).
- **Checkpoint terminal**. Los 3 pasos humanos son críticos — sin ellos el setup no funciona. No intentes automatizarlos.

## Referencias

- `references/files/` — templates de los ficheros rígidos.
- `references/claude-md-snippet.md` — sección Conventional Commits para el CLAUDE.md del proyecto.
- `references/checkpoint.md` — bloque de los 3 pasos humanos finales.
- `references/version-badge-spec.md` — contrato del badge opcional con adaptaciones por stack.
