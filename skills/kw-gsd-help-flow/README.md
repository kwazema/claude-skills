# kw-gsd-help-flow

Agente de ruteo del pipeline GSD. Cuatro modos: chuleta canónica, ruteo de pipeline por tarea, modo temático para queries en lenguaje natural, y deep-dive que lee la skill GSD real bajo demanda.

## Install

```bash
npx skills add kwazema/claude-skills --skill kw-gsd-help-flow
```

## What it does

- **Modo chuleta** (`/kw-gsd-help-flow`): pipeline canónico + mapa de las 67 skills GSD clasificadas por intent
- **Modo ruteo** (`/kw-gsd-help-flow {tarea}`): detecta señales en la descripción y propone qué comandos invocar, en qué orden, y qué saltar
- **Modo temático** (`/kw-gsd-help-flow skills para X`): filtra 2-4 skills relevantes con criterio de cuál elegir
- **Modo deep-dive** (`/kw-gsd-help-flow explícame gsd-X` o `cómo cerrar Z`): lee `~/.claude/skills/gsd-{nombre}/SKILL.md` y resume argumentos, flags, comportamiento y casos de uso
- No ejecuta nada — solo orienta. Manual-only, nunca auto-trigger

## Examples

> `/kw-gsd-help-flow`

Imprime la chuleta completa: pipeline canónico, mapa de skills, cadenas de flujo recomendadas, tips de ruteo.

> `/kw-gsd-help-flow añadir soporte para exportador A3`

Detecta "añadir" como feature, propone pipeline `phase add → spec-phase → spike → discuss → plan → execute` con justificación de qué saltar.

> `/kw-gsd-help-flow skills para mejorar la documentación`

Filtra 3 skills relevantes (`gsd-docs-update`, `gsd-extract-learnings`, `gsd-milestone-summary`) y da criterio de cuál usar según el caso.

> `/kw-gsd-help-flow cómo cerrar gsd milestone`

Devuelve la cadena ordenada: `audit-uat → audit-milestone → milestone-summary → review-backlog → complete-milestone → kw-audit-references → cleanup`.

> `/kw-gsd-help-flow explícame gsd-ship`

Lee la skill real instalada y resume propósito, argumentos, cuándo usarlo, y diferencias con comandos relacionados.

## Triggers

`cómo empiezo`, `qué comando uso`, `por dónde empiezo`, `flujo gsd`, `chuleta gsd`, `ayuda gsd`, `skills para`, `qué uso para`, `cómo cerrar`, `explícame gsd-`, `/kw-gsd-help-flow`

**Requires:** [Get Shit Done (GSD)](https://github.com/get-shit-done-ai/get-shit-done) workflow.

See [SKILL.md](./SKILL.md) for the full workflow.
