---
name: kw-gsd-help-flow
description: >
  Chuleta y guía del pipeline GSD. Modo híbrido: sin argumento muestra el flujo completo
  (explore → spec-phase → spike → sketch → discuss → plan → execute) con disparadores y
  atajos; con argumento analiza la tarea descrita y propone el pipeline específico para
  ella. Úsala cuando el usuario diga "cómo empiezo", "qué comando uso", "por dónde empiezo",
  "flujo gsd", "chuleta gsd", "ayuda gsd", "/kw-gsd-help-flow", o necesite un recordatorio
  del pipeline. Manual-only, nunca auto-trigger.
---

# GSD Help Flow

Chuleta del pipeline GSD y guía de ruteo. Te recuerda el flujo completo y te orienta cuando tienes la cabeza saturada y no sabes por dónde empezar.

## Dos modos

### Modo 1: Chuleta (sin argumento)

```
/kw-gsd-help-flow
```

Muestra el pipeline completo + tabla de disparadores + atajos + tips. No modifica nada, solo imprime la guía.

### Modo 2: Ruteo específico (con argumento)

```
/kw-gsd-help-flow añadir soporte para exportador A3
/kw-gsd-help-flow arreglar filtro de facturas que no pagina bien
/kw-gsd-help-flow no sé si Mistral OCR funciona con PDFs rotados
```

Analiza la descripción, detecta señales, y propone pipeline específico — qué comandos invocar, en qué orden, y qué se puede saltar. Justificación corta (1 línea por paso).

## Cómo analizar el argumento

Busca estas señales en el texto del argumento:

| Señal en el texto | Implicación |
|-------------------|-------------|
| "arregla", "fix", "bug", "no va", síntoma | Bug → `/gsd-debug` (investigar) o `/gsd-quick` (si fix claro) |
| "añadir", "implementar", "nuevo", feature grande | Feature → fase completa con spec + discuss + plan + execute |
| "explorar", "idea", "no sé si", "pensaba en" | Exploratorio → `/gsd-explore` primero |
| "validar si", "ver si funciona", "es viable" | Feasibility → `/gsd-spike` |
| "cómo se vería", "diseño", "layout", "UI" | UI abierta → `/gsd-sketch` |
| "pequeño", "trivial", "rápido", fix 1-línea | Atajo → `/gsd-quick` o `/gsd-fast` |
| "migrar", "cambiar X por Y" (scope acotado) | `/gsd-quick` con atomic commits |

Propón pipeline concreto tipo:

```
Para "añadir soporte para exportador A3":
1. /gsd-add-phase → crear fase formal
2. /gsd-spec-phase {N} → clarificar WHAT (qué formatos, qué clientes, reemplaza o convive)
3. /gsd-spike a3-plugin-format → validar si tu exporter pluggable aguanta
4. /gsd-sketch selector-exportador → (solo si el UI del selector no está decidido)
5. /gsd-discuss-phase {N} → decisiones técnicas del cómo
6. /gsd-plan-phase {N} → tareas concretas
7. /gsd-execute-phase {N} → ejecutar

Saltar spike si confías en el formato. Saltar sketch si la UI ya está.
```

---

## Pipeline completo (cheatsheet)

```
/gsd-explore       → "no sé aún qué es esto ni si merece fase"
/gsd-add-phase     → crear fase formal en ROADMAP
/gsd-spec-phase    → "¿QUÉ entrega la fase y por QUÉ?" (ambiguity score)
/gsd-spike         → "antes de arquitecturar, ¿es viable técnicamente?"
/gsd-sketch        → "antes de definir UI, ¿cómo se vería?" (mockups HTML)
/gsd-discuss-phase → "¿CÓMO la construimos?" (gray areas)
/gsd-plan-phase    → tareas concretas en PLAN.md
/gsd-execute-phase → ejecutar con atomic commits y waves paralelas
```

## Tabla de disparadores (cuándo usar qué)

| Comando | Cuándo |
|---------|--------|
| `/gsd-explore` | Idea sin forma. Puede terminar en nota, todo, seed o nueva fase |
| `/gsd-add-phase` | Ya sabes que merece fase. Crea entrada en ROADMAP |
| `/gsd-spec-phase {N}` | Fase creada pero WHAT ambiguo. Produce SPEC.md bloqueado |
| `/gsd-spike {tema}` | Duda técnica binaria: "¿esto funciona?" |
| `/gsd-sketch {tema}` | Decisión de UI/layout con 2-3 variantes que comparar |
| `/gsd-discuss-phase {N}` | SPEC claro, decidir el HOW |
| `/gsd-plan-phase {N}` | Decisiones tomadas, escribir tareas |
| `/gsd-execute-phase {N}` | Plan listo, ejecutar |
| `/gsd-debug` | Bug real, investigar antes de tocar |
| `/gsd-quick` | Fix concreto con orden clara, merece trazabilidad GSD |
| `/gsd-fast` | Trivial de verdad — sin subagentes, sin ceremonia |

## Atajos válidos

- Fase clara sin ambigüedad WHAT → saltas `spec-phase`, entras en `discuss`
- Sin dudas técnicas → saltas `spike`
- Sin UI abierta → saltas `sketch`
- Fase pequeña con orden de acción → `/gsd-quick` directo
- Fase que ya discutiste mentalmente → `/gsd-discuss-phase {N} --all`
- Encadenar sin paradas → `/gsd-discuss-phase {N} --chain` (discuss → plan → execute)

## Cuándo saltar GSD entero

GSD es overhead para:

- **Typos y cambios triviales de texto** (copy, labels, docs cortos). Edit directo.
- **Lectura o explicación de código** (no hay cambios, no hay trazabilidad que preservar).
- **Configuración personal del entorno** (CLAUDE.md, settings.json, skills propias, keybindings).
- **Modo plan de Claude Code activo** (el plan es el artefacto de control, no GSD).

En estos casos, Edit/Write directo sin comando GSD previo.

## Post-fase (cadena estándar)

Al terminar una fase de ejecución, aplicar según qué tocó:

- `/kw-check-migrations-supabase` — si tocó schema Supabase
- `/gsd-verify-work` — UAT conversacional, siempre útil
- `/gsd-validate-phase` — Nyquist validation retroactiva
- `/gsd-code-review` + `/gsd-code-review-fix` — bugs y calidad
- `/gsd-ui-review` — si tocó frontend
- `/gsd-eval-review` — si tocó AI/LLM
- `/gsd-secure-phase` — si había threat model

## Cierre de milestone

- `/gsd-complete-milestone` — archivar milestone
- `/kw-audit-references` — auditar `.planning/reference/` contra código real
- `/kw-stack-audit` — revisar tooling y base del proyecto
- `/kw-code-cleanup` — añadir fase de limpieza si hay deuda de código
- `/gsd-cleanup` — archivar directorios de fases completadas
- `/gsd-health` — diagnóstico y reparación del directorio `.planning/`

## Tips prácticos

- **Spec-phase sale caro en tiempo** pero ahorra refactors masivos después. Úsalo cuando el WHAT huele ambiguo.
- **Spike es binario**: responde sí/no a una pregunta concreta con código desechable. Si te descubres "mejorando el spike", para — ya pasó a implementación.
- **Sketch es caro en contexto** (carga 4 references de estilo). Resérvalo para decisiones de layout o flujo grandes, no para componentes pequeños.
- **En la duda, modo investigación.** Regla del `CLAUDE.md` global — mejor preguntar de más que tocar código a ciegas.
- **No hagas el pipeline completo siempre.** Añade cada paso solo si hay incertidumbre real en esa dimensión. Spec resuelve WHAT, spike resuelve feasibility, sketch resuelve UI, discuss resuelve HOW.
- **Wrap-ups para persistir aprendizajes.** Si un spike o sketch enseñó algo reutilizable en fases futuras, `/gsd-spike-wrap-up` o `/gsd-sketch-wrap-up` lo empaqueta en skill de proyecto.

## Ejemplos de sesión híbrida

### Ejemplo 1: feature grande

**Input:**
```
/kw-gsd-help-flow quiero que las facturas duplicadas se detecten al subir y avisar al usuario
```

**Output esperado:**
```
Señales detectadas: "quiero que" = feature, "al subir" = toca flow existente, "avisar al usuario" = UX abierta.

Pipeline propuesto:
1. /gsd-explore detección-facturas-duplicadas
   → Decidir criterio de duplicado (CIF+fecha+total? hash PDF? solicitar confirmación?)
2. /gsd-add-phase "Detección de facturas duplicadas"
3. /gsd-spec-phase {N}
   → WHAT/WHY: ¿bloqueo duro o solo aviso? ¿qué datos de duplicado mostrar?
4. /gsd-sketch aviso-duplicados
   → 2-3 variantes: modal bloqueante vs toast vs inline en lista
5. /gsd-discuss-phase {N}
   → Dónde vive la detección (Edge Function? trigger SQL? frontend?)
6. /gsd-plan-phase {N}
7. /gsd-execute-phase {N}

Se salta: spike (no hay duda técnica — es SQL + UI estándar).
```

### Ejemplo 2: bug localizado

**Input:**
```
/kw-gsd-help-flow el filtro de facturas no respeta el estado "exportado"
```

**Output esperado:**
```
Señales detectadas: "no respeta" = bug, scope concreto, sin UI nueva.

Pipeline propuesto:
1. /gsd-debug filtro-estado-exportado
   → Localizar dónde se ignora el estado (servicio? hook? query Supabase?)
2. /gsd-quick
   → Aplicar fix con atomic commit cuando esté claro

Se salta: toda la cadena de fase (es mantenimiento, no feature).
```

---

**Recordatorio:** esta skill NO ejecuta ningún comando GSD. Solo muestra la guía o propone el pipeline. Tú decides qué invocar.
