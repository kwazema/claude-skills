---
name: kw-pr-review
description: >
  Lee reviews de bots de un PR en GitHub (Codex, CodeRabbit, Cubic, Sourcery),
  evalúa cada finding contra la arquitectura del proyecto con agentes en paralelo,
  y aplica solo lo que aporta valor real. Manual-only — invocar explícitamente.
  Triggers: "pr review", "revisar pr", "codex review", "review del pr",
  "aplicar findings", "/kw-pr-review".
argument-hint: "[PR# | URL | vacío] [--source codex,coderabbit] [--severity P1,P2] [--dry-run]"
disable-model-invocation: true
---

# kw-pr-review

Lectura, evaluación crítica y aplicación selectiva de findings de bots de revisión en PRs de GitHub. Multi-bot: Codex, CodeRabbit, Cubic (en GitHub), Sourcery. Patrón de agentes paralelos + Q&A + commit atómico por fix.

## When to Use

Manual-only. Invocar tras:
- Abrir un PR y recibir reviews automáticos de Codex/CodeRabbit
- Mergear un PR sin revisar findings (aplicar a `main` retroactivamente)
- Querer un análisis filtrado antes de pulsar "Resolve conversation" en GitHub

Nunca auto-trigger — la skill modifica código y hace commits.

## Arguments

Tres formas de invocación:

| Invocación | Resolución |
|------------|------------|
| `/kw-pr-review` | Autodetect: `gh pr view --json number,headRepository` desde la rama actual |
| `/kw-pr-review 13` | PR `#13` del repo actual (derivado de `git remote get-url origin`) |
| `/kw-pr-review https://github.com/owner/repo/pull/13` | Cross-repo via URL |

Flags opcionales (todos combinables):
- `--source codex,coderabbit,cubic,sourcery` — filtrar por bot (default: todos los reviewers reconocidos)
- `--severity P1,P2,P3` — filtrar por severidad (default: todos)
- `--dry-run` — solo análisis, no aplica nada ni hace commits

## Workflow

### 1. Resolver el PR

Parse el primer argumento:
- URL → extraer `owner`, `repo`, `n`
- Número → usar repo actual de `git remote get-url origin`
- Vacío → `gh pr view --json number,headRepository` para autodetect

Validar con `gh pr view <n> --json number,title,headRefName,baseRefName,state`. Si el estado es `MERGED` o `CLOSED`, avisar pero continuar (revisar findings retroactivos es válido).

### 2. Leer findings de 3 endpoints en paralelo

```bash
gh api repos/{owner}/{repo}/pulls/{n}/reviews
gh api repos/{owner}/{repo}/pulls/{n}/comments
gh api repos/{owner}/{repo}/issues/{n}/comments
```

Filtrar por la whitelist de reviewers conocidos (ver `references/bot-formats.md`):
- `chatgpt-codex-connector[bot]` → Codex
- `coderabbitai[bot]` → CodeRabbit
- `cubic-dev-ai[bot]` → Cubic
- `sourcery-ai[bot]` → Sourcery

Ignorar bots de infra: `vercel[bot]`, `supabase[bot]`, `netlify[bot]`, `dependabot[bot]`, `renovate[bot]`, `github-actions[bot]`.

### 3. Normalizar findings a un schema único

```
{
  source: "codex" | "coderabbit" | "cubic" | "sourcery",
  severity: "P1" | "P2" | "P3" | "info",
  path: string | null,        // null si es top-level
  line: number | null,
  title: string,
  description: string,
  url: string                 // link al comentario en GitHub
}
```

La lógica de parseo por bot vive en `references/bot-formats.md`. Lee ese archivo antes de procesar findings — contiene los regex, mapeos de severidad y reglas de filtrado.

Aplicar los filtros `--source` y `--severity` aquí, antes del paso 4.

### 4. Cargar contexto del proyecto

Leer (en orden, si existe cada uno):
- `.planning/codebase/ARCHITECTURE.md`
- `.planning/codebase/CONVENTIONS.md`
- `.planning/reference/*.md` (todo el directorio)
- `.planning/ROADMAP.md`
- `CLAUDE.md` raíz
- `AGENTS.md` raíz

Si nada de `.planning/` existe, continuar solo con `CLAUDE.md` + `AGENTS.md`. Este contexto es la lente para clasificar findings en el paso 5.

### 5. Spawn agentes en paralelo (uno por archivo afectado)

**Agrupar findings por archivo.** Si un bot deja 3 sugerencias en `src/services/X.ts`, un solo agente las evalúa todas con el archivo cargado en contexto. Máximo 5 agentes simultáneos — si hay más archivos, batchear.

Cada agente (tipo `general-purpose`) recibe:
- Lista de findings normalizados del archivo
- Contenido completo del archivo afectado
- Resumen del contexto del proyecto (ARCHITECTURE + CONVENTIONS + reference relevantes)
- Instrucción de grep dependencias si lo necesita (imports, hooks/services relacionados)

Cada agente devuelve por finding:
```
{
  finding_id: "<source>:<path>:<line>",
  verdict: "APLICAR" | "DESCARTAR" | "DEBATIR",
  reason: string (1-3 líneas),
  proposed_diff: string | null
}
```

Criterios en el prompt del agente:
- **APLICAR** — bug real, no contradice arquitectura, no es cosmético, no toca código auto-generado
- **DESCARTAR** — falso positivo, contradice arquitectura/decisión documentada, cosmético sin impacto, toca código generado (`src/integrations/supabase/types.ts`, `*.gen.ts`, `dist/`), ya resuelto en commits posteriores al `commit_id` del review
- **DEBATIR** — válido pero requiere decisión humana (cambio de API pública, trade-off de rendimiento, refactor de alcance no trivial)

### 6. Síntesis y presentación

Mostrar tabla resumen:

```
| Source     | P1 | P2 | P3 | Aplicar | Descartar | Debatir |
|------------|----|----|----|---------|-----------|---------|
| codex      | 3  | 3  | 2  | 5       | 2         | 1       |
| coderabbit | 0  | 4  | 6  | 4       | 5         | 1       |
```

Después, listar por archivo cada finding con su verdict y razón. Para cada **DEBATIR**, usar `AskUserQuestion` con opciones: APLICAR / DESCARTAR / DEJAR ABIERTO. Máximo 4 preguntas por turno — si hay más, agrupar en tandas.

Tras la Q&A, presentar plan final: lista de fixes a aplicar con path, título y resumen del diff propuesto.

### 7. Aplicar fixes aprobados

Si `--dry-run`, parar aquí.

Confirmación final con `AskUserQuestion`: "Aplicar los N fixes ahora?". Si afirmativo, por cada fix:

1. `Read` del archivo (si no se cargó ya)
2. `Edit` con el diff propuesto
3. Commit atómico:
   ```bash
   git commit -m "fix({short-path}): {title corto del finding}"
   ```

**Un commit por fix**, no batch — facilita revert selectivo si UAT descubre regresión.

Al final, resumen:
- N fixes aplicados (con SHA de cada commit)
- M descartados (con razón breve)
- P pendientes / dejados abiertos (con link al comentario en GitHub)

## Key Principles

- **Evidence-based**: cada verdict cita el archivo y la razón concreta. Nunca "creo que sí".
- **Arquitectura primero**: ningún fix que contradiga `CONVENTIONS.md` o decisiones de `.planning/reference/`.
- **Atómico**: un commit por fix, mensaje convencional `fix({path}): {título}`.
- **Interactivo**: nunca aplicar sin confirmación final. Q&A para todo lo DEBATIR.
- **No tocar generados**: `src/integrations/supabase/types.ts`, `*.gen.ts`, `dist/`, snapshots de tests.
- **Bot-agnóstico**: añadir un nuevo bot solo requiere editar `references/bot-formats.md`.

## References

- `references/bot-formats.md` — parseo detallado por bot, mapeo de severidad y whitelist editable
