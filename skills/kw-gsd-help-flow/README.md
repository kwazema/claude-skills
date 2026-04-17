# kw-gsd-help-flow

Chuleta y guía de ruteo del pipeline GSD. Modo híbrido: sin argumento imprime el flujo completo; con argumento analiza la tarea y propone el pipeline específico para ella.

## Install

```bash
npx skills add kwazema/claude-skills --skill kw-gsd-help-flow
```

## What it does

- **Modo chuleta** (`/kw-gsd-help-flow` sin argumento): muestra el pipeline completo (explore → spec-phase → spike → sketch → discuss → plan → execute), tabla de disparadores, atajos válidos y tips
- **Modo ruteo** (`/kw-gsd-help-flow {tarea}`): detecta señales en la descripción y propone qué comandos invocar, en qué orden, y qué se puede saltar
- No ejecuta nada — solo orienta. Útil cuando no sabes por dónde empezar o necesitas refrescar el flujo
- Manual-only, nunca auto-trigger

## Examples

> `/kw-gsd-help-flow`

Imprime la chuleta completa del pipeline GSD.

> `/kw-gsd-help-flow añadir soporte para exportador A3`

Detecta "añadir" como feature, propone pipeline `add-phase → spec-phase → spike → discuss → plan → execute` con justificación de qué saltar.

## Triggers

`cómo empiezo`, `qué comando uso`, `por dónde empiezo`, `flujo gsd`, `chuleta gsd`, `ayuda gsd`, `/kw-gsd-help-flow`

**Requires:** [Get Shit Done (GSD)](https://github.com/get-shit-done-ai/get-shit-done) workflow.

See [SKILL.md](./SKILL.md) for the full workflow.
