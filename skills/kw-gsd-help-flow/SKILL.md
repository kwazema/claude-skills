---
name: kw-gsd-help-flow
description: >
  Chuleta y agente de ruteo del pipeline GSD. Cuatro modos:
  (1) sin argumento muestra el pipeline canónico y el mapa de skills;
  (2) con tarea, propone pipeline específico (feature/bug/exploración);
  (3) con query temática ("skills para X"), filtra 2-4 skills con criterio;
  (4) con "explícame gsd-X" o "cómo cerrar Z", lee la skill GSD real y resume argumentos y uso.
  Triggers: "cómo empiezo", "flujo gsd", "chuleta gsd", "ayuda gsd",
  "skills para", "cómo cerrar", "explícame gsd-", "gsd core", "qué cambió en gsd".
  Manual-only, nunca auto-trigger.
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

Este archivo es **solo el MAPA**. La fuente autoritativa vive en `~/.claude/skills/gsd-{nombre}/SKILL.md` (su `argument-hint` es la lista real de flags).

- **Profundiza leyendo la skill real** cuando: piden argumentos/flags concretos, casos límite, modo 4 ("explícame gsd-X"), o la respuesta depende de detalles que cambian entre releases.
- **Basta con el mapa** cuando: piden "qué skills existen para X", cadenas de flujo (post-fase, cierre milestone), exploración sin saber el comando exacto.

References de esta skill, cargar bajo demanda:

| Archivo | Cuándo |
|---|---|
| `references/flags.md` | Flags detallados del núcleo, comandos consolidados/renombrados, verbos vs flags, separador `-` vs `:` |
| `references/gsd-core.md` | La transición GSD → GSD Core, novedades por versión, dualidad de instalación, watch-outs |

## GSD Core (versión de referencia: 1.10.0, ago-2026)

GSD se llama **GSD Core** (`@opengsd/gsd-core`, repo `open-gsd/gsd-core`): continuación comunitaria tras la salida del creador original. El pipeline, los comandos `/gsd-*` y el formato `.planning/` NO cambian; el versionado se reseteó (1.x nueva > 1.42.x legacy). Updates con `/gsd-update` normal (`--next` para canal RC).

En instalación de skills planas (`~/.claude/skills/gsd-*/`) los comandos son `/gsd-X` con guion. La forma `/gsd:X` con dos puntos solo aplica si se instala como plugin de Claude Code (`commands/gsd/`). El template `claude-md.md` de 1.10.0 escribe la forma con dos puntos: si un `CLAUDE.md` generado la trae y tú usas skills planas, es cosmético, no un comando roto.

- **Si la consulta trata del cambio, la migración o las novedades** (capabilities, coverage-UAT, drift precheck, MemPalace…): lee `references/gsd-core.md` de esta skill.
- Para todo lo demás, este mapa y las skills reales siguen siendo la fuente.

────────────────────────────────────────────────────────────

## Pipeline canónico

```
/gsd-next           → "no sé por dónde seguir" (detecta estado y propone acción)
/gsd-explore        → "no sé aún qué es esto ni si merece fase"
/gsd-phase "{desc}" → crear fase formal en ROADMAP (sin flag = add)
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

## Mapa de skills (71)

**Inicio:** `gsd-new-project` (`--auto`) · `gsd-onboard` (codebase existente: mapea + ingesta docs + prepara planning; `--fast`) · `gsd-new-milestone` (abrir cycle, `--ws`, `--reset-phase-numbers`) · `gsd-import` (`--from <file>`) · `gsd-ingest-docs` (bootstrap desde ADRs/PRDs)

**Pipeline core:** `gsd-explore` · `gsd-spec-phase` · `gsd-spike` · `gsd-sketch` · `gsd-discuss-phase` · `gsd-plan-phase` · `gsd-execute-phase`

**Variantes de fase:** `gsd-ui-phase` (UI-SPEC) · `gsd-ai-integration-phase` (AI-SPEC) · `gsd-mvp-phase` (SPIDR splitting) · `gsd-ultraplan-phase` [BETA, cloud]

**Phase CRUD:** `gsd-phase` — sin flag añade fase al final; `--insert` (decimal N.1), `--remove` (renumera), `--edit`

> ⚠️ `/gsd-phase add` **no existe**. La skill usa flags; el binario `gsd-tools.cjs` usa verbos (`phase add`). Son superficies distintas: ver `references/flags.md`.

**Post-fase / verificación:** `gsd-verify-work` (UAT, `--ws`) · `gsd-validate-phase` (Nyquist) · `gsd-code-review` (`--depth=quick|standard|deep`, `--files`, `--fix [--all] [--auto]`) · `gsd-ui-review` (6-pilares) · `gsd-eval-review` (AI) · `gsd-secure-phase` (threat model) · `gsd-add-tests` (desde UAT) · `gsd-extract-learnings`

**PR / Ship:** `gsd-ship` (PR + review + merge) · `gsd-pr-branch` (filtra `.planning/`)

**Cierre milestone:** `gsd-audit-uat` · `gsd-audit-milestone` · `gsd-milestone-summary` · `gsd-review-backlog` · `gsd-complete-milestone`

**Estado:** `gsd-next` (smart entry, sin argumentos) · `gsd-progress` (`--do "tarea"`, `--next [--auto] [--converge]`, `--forensic`) · `gsd-manager` (`--analyze-deps`) · `gsd-stats` · `gsd-health` (`--context`, `--repair`) · `gsd-surface` (`list|status|profile|disable|enable|reset`)

**Threads/workspace/parallel:** `gsd-thread` (`list|close|status <slug>`) · `gsd-workspace` (`--new|--list|--remove`) · `gsd-workstreams` (paralelo) · `gsd-pause-work` (`--report`) · `gsd-resume-work`

**Codebase intel:** `gsd-map-codebase` (`--fast [--focus tech|arch|quality|concerns]`, `--query <term>|status|diff|refresh`) · `gsd-graphify` (`build|query|status|diff`) · `gsd-docs-update` (`--force`, `--verify-only`)

**Memoria cross-proyecto (opt-in, MemPalace):** `gsd-mempalace-capture` · `gsd-mempalace-recall`

**Captura rápida:** `gsd-capture` (sin flag = todo estructurado) · `gsd-fast` (trivial inline) · `gsd-quick` (`--full`, `--validate`, `--discuss`, `--research`, `list|status|resume <slug>`)

**Debug y forensics:** `gsd-debug` (`list|status|continue <slug>`, `--diagnose`) · `gsd-forensics` (post-mortem) · `gsd-audit-fix` (`--source`, `--severity`, `--max N`, `--dry-run`)

**Peer review:** `gsd-review` (`--phase N` + CLI: `--claude --codex --gemini --cursor --qwen --opencode --agy --all`) · `gsd-plan-review-convergence` (`--max-cycles N`, mismos CLIs + `--coderabbit --ollama --lm-studio --kimi-code`) · `gsd-inbox` (`--issues`, `--prs`, `--repo owner/repo`)

**Modo autónomo:** `gsd-autonomous` (`--from N`, `--to N`, `--only N`, `--interactive`, `--converge`)

**Sistema:** `gsd-config` (`--advanced`, `--integrations`, `--profile <name>`) · `gsd-update` (`--sync`, `--reapply`, `--next`) · `gsd-help` (`--brief|--full|<topic>`) · `gsd-undo` (`--last N`, `--phase NN`, `--plan NN-MM`) · `gsd-cleanup`

**Namespaces (fallback):** `gsd-ns-ideate` · `gsd-ns-workflow` · `gsd-ns-context` · `gsd-ns-review` · `gsd-ns-project` · `gsd-ns-manage`

**Otros:** `gsd-profile-user` (`--questionnaire`, `--refresh`)

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

**Trabajo paralelo:** `workstreams create {n}` → `workspace --new {n}` → `manager` → `autonomous --interactive`
⚠️ `autonomous` sin `--interactive` no pide confirmaciones — solo con plans ya revisados.

## Modos especiales (cuándo conviene)

- **`gsd-autonomous`** — 5+ fases con PLAN.md maduro. Riesgo si los plans no están revisados.
- **`gsd-manager`** — coordinar 3+ fases paralelas desde una terminal.
- **`gsd-workstreams`** — paralelo sin conflictos (branches/fases independientes).
- **`gsd-workspace`** — sandbox de planificación aislado (probar reorganización del roadmap).
- **`gsd-thread`** — work cross-sesión que no encaja en una fase única.

────────────────────────────────────────────────────────────

## Captura rápida (bypass del pipeline)

`/gsd-capture "texto"` **sin flag** crea un todo estructurado en `.planning/todos/`. No existe `--todo`: ese es el comportamiento por defecto. Con flag: `--note` (idea de fricción cero) · `--backlog` (aparca en ROADMAP con numeración 999.x) · `--seed` (idea con condición de disparo para un milestone futuro) · `--list` (browser interactivo de todos) · `--list-seeds` (auditoría de seeds, read-only).

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

## Comportamiento que cambió (1.7 → 1.10)

Altera lo que ves al ejecutar, no solo la lista de comandos:

- **`status: halted` en SUMMARY.md.** Parada por diseño (un spike que responde "no") es éxito, no fallo. Propaga transitivamente por `depends_on`: los dependientes salen *blocked* en vez de ofrecerse al executor. Si `progress` dice "blocked", busca el SUMMARY con `halted` antes de tocar nada.
- **Los gates `blocking-human` ya no se auto-aprueban.** `autonomous` para de verdad donde el plan dice que hay que parar.
- **El verifier se abstiene** en verdades `backstop` no inferibles en vez de dar false-pass (`PRESENT_BEHAVIOR_UNVERIFIED` → juicio humano).
- **`plan-phase` abre con un tracer slice E2E** por defecto (`--no-tracer` lo desactiva).
- **Hook write-guard**: bloquea un `Write` de fichero completo que encogería un artefacto `.planning/` curado. Append y edits puntuales no se ven afectados.

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
Pipeline: explore (criterio) → phase (sin flag) → spec-phase → sketch (modal/toast/inline)
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

**Ejemplo 3 — temático:** `skills para mejorar la documentación` → filtra a 3 con criterio explícito: `gsd-docs-update` (README/architecture verificados contra código) · `gsd-extract-learnings` (destila decisiones de fases cerradas) · `gsd-milestone-summary` (onboarding). Nunca listar 15.

**Ejemplo 4 — deep-dive:** `explícame gsd-ship` → leer `~/.claude/skills/gsd-ship/SKILL.md` y resumir propósito, argumentos reales, cuándo usarlo (tras `verify-work` en verde) y diferencia con el vecino confundible (`pr-branch` solo filtra `.planning/`; `ship` orquesta el PR completo).

────────────────────────────────────────────────────────────

**Recordatorio:** esta skill NO ejecuta ningún comando GSD. Solo orienta y consulta otras skills bajo demanda. Tú decides qué invocar.
