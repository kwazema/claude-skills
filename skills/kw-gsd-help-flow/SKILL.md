---
name: kw-gsd-help-flow
description: >
  Chuleta y agente de ruteo del pipeline GSD. Cuatro modos:
  (1) sin argumento muestra el pipeline canónico y el mapa de skills;
  (2) con tarea, propone pipeline específico (feature/bug/exploración);
  (3) con query temática ("skills para X"), filtra 2-4 skills con criterio;
  (4) con "explícame gsd-X" o "cómo cerrar Z", lee la skill GSD real y resume argumentos y uso.
  Triggers: "cómo empiezo", "flujo gsd", "chuleta gsd", "ayuda gsd",
  "skills para", "cómo cerrar", "explícame gsd-". Manual-only, nunca auto-trigger.
---

# GSD Help Flow

Agente de ruteo del pipeline GSD. No ejecuta comandos — orienta, propone cadenas y explica skills bajo demanda.

## Cuatro modos

| Modo | Input | Qué hace |
|------|-------|----------|
| **Chuleta** | `/kw-gsd-help-flow` | Imprime pipeline canónico + mapa de skills |
| **Ruteo** | `/kw-gsd-help-flow añadir X` / `arreglar Y` / `no sé si Z` | Detecta señales (feature/bug/exploración/UI/spike) y propone cadena con qué saltar |
| **Temático** | `/kw-gsd-help-flow skills para X` / `qué uso para Y` | Filtra 2-4 skills relevantes del mapa con criterio |
| **Deep-dive** | `/kw-gsd-help-flow explícame gsd-X` / `cómo cerrar Z` | Lee `~/.claude/skills/gsd-{nombre}/SKILL.md` y resume argumentos, flags y uso |

## Source of truth

Este archivo es **solo el MAPA**. La fuente autoritativa vive en `~/.claude/skills/gsd-{nombre}/SKILL.md`.

- **Profundiza leyendo la skill real** cuando: piden argumentos/flags concretos, casos límite, modo 4 ("explícame gsd-X"), o la respuesta depende de detalles que cambian entre releases.
- **Basta con el mapa** cuando: piden "qué skills existen para X", cadenas de flujo (post-fase, cierre milestone), exploración sin saber el comando exacto.

────────────────────────────────────────────────────────────

## Pipeline canónico

```
/gsd-explore        → "no sé aún qué es esto ni si merece fase"
/gsd-phase add      → crear fase formal en ROADMAP
/gsd-spec-phase     → "¿QUÉ entrega y por QUÉ?" (ambiguity score)
/gsd-spike          → "¿es viable técnicamente?" (binario, código desechable)
/gsd-sketch         → "¿cómo se vería?" (mockups HTML, 2-3 variantes)
/gsd-discuss-phase  → "¿CÓMO la construimos?" (gray areas)
   ├─ /gsd-ui-phase             → rama paralela: UI-SPEC.md (frontend)
   └─ /gsd-ai-integration-phase → rama paralela: AI-SPEC.md (LLM/AI)
/gsd-plan-phase     → tareas concretas en PLAN.md
/gsd-execute-phase  → ejecutar con atomic commits y waves paralelas
```

`ui-phase` y `ai-integration-phase` no reemplazan `discuss-phase` — la complementan. Sus outputs alimentan el `plan-phase` posterior.

## Mapa de skills (67)

**Inicio:** `gsd-new-project` (PROJECT.md + context) · `gsd-new-milestone` (abrir cycle) · `gsd-import` (plans externos) · `gsd-ingest-docs` (bootstrap desde ADRs/PRDs)

**Pipeline core:** `gsd-explore` · `gsd-spec-phase` · `gsd-spike` · `gsd-sketch` · `gsd-discuss-phase` · `gsd-plan-phase` · `gsd-execute-phase`

**Variantes de fase:** `gsd-ui-phase` (UI-SPEC) · `gsd-ai-integration-phase` (AI-SPEC) · `gsd-mvp-phase` (SPIDR splitting) · `gsd-ultraplan-phase` [BETA, cloud]

**Phase CRUD:** `gsd-phase` (add | insert N.1 | remove | edit)

**Post-fase / verificación:** `gsd-verify-work` (UAT) · `gsd-validate-phase` (Nyquist) · `gsd-code-review` (auto-fix con `--fix`) · `gsd-ui-review` (6-pilares) · `gsd-eval-review` (AI) · `gsd-secure-phase` (threat model) · `gsd-add-tests` (desde UAT) · `gsd-extract-learnings`

**PR / Ship:** `gsd-ship` (PR + review + merge) · `gsd-pr-branch` (filtra `.planning/`)

**Cierre milestone:** `gsd-audit-uat` · `gsd-audit-milestone` · `gsd-milestone-summary` · `gsd-review-backlog` · `gsd-complete-milestone`

**Estado:** `gsd-progress` (`--do` directo, `--next` siguiente) · `gsd-manager` (command center multi-fase) · `gsd-stats` · `gsd-health` (`--context` guard) · `gsd-surface` (clusters)

**Threads/workspace/parallel:** `gsd-thread` (cross-sesión) · `gsd-workspace` (sandbox) · `gsd-workstreams` (paralelo) · `gsd-pause-work` · `gsd-resume-work`

**Codebase intel:** `gsd-map-codebase` (`--fast`, `--query`) · `gsd-graphify` (knowledge graph) · `gsd-docs-update` (docs verificados)

**Captura rápida:** `gsd-capture` (router por flags) · `gsd-fast` (trivial inline) · `gsd-quick` (fix con atomic commits)

**Debug y forensics:** `gsd-debug` (científico, estado persistente) · `gsd-forensics` (post-mortem) · `gsd-audit-fix` (autónomo audit→fix)

**Peer review:** `gsd-review` (cross-AI) · `gsd-plan-review-convergence` (loop hasta sin HIGH) · `gsd-inbox` (triage GitHub)

**Modo autónomo:** `gsd-autonomous` (todas las fases en automático)

**Sistema:** `gsd-config` (workflow/integraciones/profile) · `gsd-update` (`--sync`, `--reapply`) · `gsd-help` (chuleta nativa) · `gsd-undo` (revert con deps) · `gsd-cleanup`

**Namespaces (fallback):** `gsd-ns-ideate` · `gsd-ns-workflow` · `gsd-ns-context` · `gsd-ns-review` · `gsd-ns-project` · `gsd-ns-manage`

**Otros:** `gsd-profile-user` (perfil developer one-off)

────────────────────────────────────────────────────────────

## Cadenas de flujo recomendadas

**Nuevo proyecto:** `gsd-new-project` → roadmap auto → `discuss-phase 1` → `plan` → `execute`

**Nueva milestone:** `gsd-new-milestone` → `review-backlog` → `spec | discuss` → `plan` → `execute`

**Post-fase (tras `execute-phase`):**
```
verify-work → validate-phase → code-review [--fix]
  → (ui-review | eval-review | secure-phase según aplique)
  → add-tests → extract-learnings
  → /kw-check-migrations-supabase (si schema)
  → ship → pr-branch
```

**Cierre milestone:**
```
audit-uat → audit-milestone → milestone-summary
  → review-backlog → complete-milestone
  → /kw-audit-references → /kw-stack-audit → cleanup
```

**Trabajo paralelo:** `workstreams new` → `workspace new` → `manager` → `autonomous --interactive`
⚠️ `autonomous` sin `--interactive` no pide confirmaciones — solo con plans ya revisados.

## Modos especiales (cuándo conviene)

- **`gsd-autonomous`** — 5+ fases con PLAN.md maduro. Riesgo si los plans no están revisados.
- **`gsd-manager`** — coordinar 3+ fases paralelas desde una terminal.
- **`gsd-workstreams`** — paralelo sin conflictos (branches/fases independientes).
- **`gsd-workspace`** — sandbox de planificación aislado (probar reorganización del roadmap).
- **`gsd-thread`** — work cross-sesión que no encaja en una fase única.

────────────────────────────────────────────────────────────

## Captura rápida (bypass del pipeline)

`/gsd-capture` enruta solo si no le pasas flag: `--todo` · `--backlog` · `--note` · `--seed` (condicional para milestone X) · `--list`

## Cuándo saltar GSD entero

- Typos, copy, labels y docs cortos → Edit directo.
- Lectura/explicación de código (no hay cambios que trazar).
- Config personal del entorno (`CLAUDE.md`, `settings.json`, skills propias).
- Modo plan de Claude Code activo (el plan es el control).

## Atajos válidos

- WHAT claro → saltar `spec-phase`, entrar en `discuss`
- Sin dudas técnicas → saltar `spike`
- UI ya decidida → saltar `sketch`
- Fase pequeña con orden de acción → `/gsd-quick`
- Ya discutida mentalmente → `/gsd-discuss-phase {N} --all`
- Encadenar sin paradas → `/gsd-discuss-phase {N} --chain` (discuss → plan → execute)

## Comandos consolidados (1.41.0 cleanup)

Si tu memoria devuelve un comando que ya no existe:

| Antes | Ahora |
|-------|-------|
| `/gsd-do "{t}"` / `/gsd-next` | `/gsd-progress --do|--next` |
| `/gsd-note`/`-plant-seed`/`-add-todo`/`-check-todos`/`-add-backlog` | `/gsd-capture --note|--seed|--todo|--list|--backlog` |
| `/gsd-scan` / `/gsd-intel` | `/gsd-map-codebase --fast|--query` |
| `/gsd-sync-skills` / `/gsd-reapply-patches` | `/gsd-update --sync|--reapply` |
| `/gsd-code-review-fix` | `/gsd-code-review --fix` |
| `/gsd-sketch-wrap-up` / `/gsd-spike-wrap-up` | `/gsd-{sketch|spike} --wrap-up` |
| `/gsd-add-phase|insert|remove|edit` | `/gsd-phase add|insert|remove|edit` |
| `/gsd-new-workspace|list|remove` | `/gsd-workspace new|list|remove` |
| `/gsd-settings-{advanced|integrations|set-profile}` | `/gsd-config` |

────────────────────────────────────────────────────────────

## Tips de ruteo

- **Pregunta antes de proponer cadena larga.** Si la query es ambigua, `AskUserQuestion` > imprimir 8 comandos a ciegas.
- **Modo temático: filtrar a 2-4.** Listar 15 skills no aporta valor. Da criterio explícito.
- **Modo deep-dive: lee la skill real.** Nunca improvises argumentos/flags — abre `~/.claude/skills/gsd-X/SKILL.md`.
- **Spec-phase sale caro** pero ahorra refactors. Úsalo cuando el WHAT huele ambiguo.
- **Spike es binario**: sí/no con código desechable. Si te descubres "mejorando el spike", para.
- **Sketch es caro en contexto** (carga 4 references de estilo). Solo para layout grandes.
- **En la duda, modo investigación** (regla del `CLAUDE.md` global).
- **No hagas el pipeline completo siempre.** Añade pasos solo si hay incertidumbre en esa dimensión.

## Ejemplos de sesión

**Ejemplo 1 — ruteo (feature):** `/kw-gsd-help-flow quiero que las facturas duplicadas se detecten al subir`
```
Señales: feature + flow existente + UX abierta.
Pipeline: explore (criterio) → phase add → spec-phase → sketch (modal/toast/inline)
          → discuss-phase (Edge Fn|SQL|frontend) → plan → execute
Salta: spike (sin duda técnica).
```

**Ejemplo 2 — ruteo (bug):** `/kw-gsd-help-flow el filtro de facturas no respeta el estado "exportado"`
```
Señales: bug, scope concreto.
1. /gsd-debug filtro-estado-exportado → localizar
2. /gsd-quick → fix con atomic commit
Salta: cadena de fase (mantenimiento, no feature).
```

**Ejemplo 3 — temático:** `/kw-gsd-help-flow skills para mejorar la documentación`
```
Tres caminos según qué doc:
- /gsd-docs-update — README/CHANGELOG/architecture verificados contra código
- /gsd-extract-learnings — destila decisiones de fases completadas
- /gsd-milestone-summary — resumen comprehensivo para onboarding
Para detalles pídeme "explícame gsd-{nombre}".
```

**Ejemplo 4 — flujo:** `/kw-gsd-help-flow cómo cerrar gsd milestone`
```
1. audit-uat → 2. audit-milestone → 3. milestone-summary
→ 4. review-backlog → 5. complete-milestone
→ 6. /kw-audit-references → 7. /kw-stack-audit → 8. cleanup

Si alguna fase tiene UAT pendiente, audit-uat te bloquea antes.
```

**Ejemplo 5 — deep-dive:** `/kw-gsd-help-flow explícame gsd-ship`
Claude lee `~/.claude/skills/gsd-ship/SKILL.md` y resume propósito, argumentos (`[phase|milestone]`), cuándo usarlo (tras `verify-work` con gates en verde) y diferencia con `pr-branch` (ship orquesta PR completo; pr-branch solo filtra `.planning/`).

────────────────────────────────────────────────────────────

**Recordatorio:** esta skill NO ejecuta ningún comando GSD. Solo orienta y consulta otras skills bajo demanda. Tú decides qué invocar.
