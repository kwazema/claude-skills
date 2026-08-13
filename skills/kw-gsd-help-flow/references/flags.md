# Flags y superficie de comandos GSD

Detalle que no cabe en el mapa. Cargar cuando el usuario pida argumentos concretos, cuando haya que corregir un comando que "no existe", o en modo deep-dive.

Verificado contra **GSD Core 1.10.0**. La fuente autoritativa siempre es `~/.claude/skills/gsd-{nombre}/SKILL.md` (campo `argument-hint` del frontmatter): si hay duda, ábrelo.

## Trampa nº1: la skill usa flags, el CLI interno usa verbos

Son dos superficies distintas y no son intercambiables:

| Quieres | Como comando (skill) | Como llamada al binario |
|---|---|---|
| Añadir fase | `/gsd-phase "descripción"` (sin flag) | `gsd-tools.cjs phase add "..."` |
| Insertar decimal | `/gsd-phase --insert 7 "..."` | `gsd-tools.cjs phase insert` |
| Workspace nuevo | `/gsd-workspace --new nombre` | — |

`/gsd-phase add` **no existe**: fallará. Los subcomandos del binario son `add`, `add-batch`, `insert`, `remove`, `complete`, `list-plans`, `next-decimal`, `uat-passed`.

## Trampa nº2: el separador depende de cómo esté instalado GSD

- **Skills planas** (`~/.claude/skills/gsd-*/`, lo que instala `npx @opengsd/gsd-core --claude --global`) → `/gsd-progress`, con **guion**.
- **Plugin de Claude Code** (`~/.claude/commands/gsd/`) → `/gsd:progress`, con **dos puntos**.

Comprobar cuál aplica: si existe `~/.claude/commands/gsd/`, es plugin; si no, son skills planas. El template `claude-md.md` de 1.10.0 escribe la forma con dos puntos, así que un `CLAUDE.md` generado puede traer comandos que no existen en una instalación de skills planas.

## Las tres skills del núcleo

**`/gsd-plan-phase {N}`** es la que más palancas tiene:

- *Investigación*: `--research` (fuerza) · `--skip-research` · `--research-phase <N>` (reusa el de otra fase)
- *Forma del plan*: `--tdd` (test-first) · `--mvp` (slice vertical) · `--granularity coarse|standard|fine` · `--chunked` (fases grandes) · `--no-tracer` (desactiva el tracer slice E2E que 1.8+ pone por defecto) · `--no-reversibility-gates`
- *Entrada externa*: `--prd <file>` · `--ingest <path|glob>` con `--ingest-format auto|nygard|madr|narrative`
- *Revisión*: `--bounce` / `--skip-bounce` · `--reviews` · `--skip-verify` · `--skip-ui`
- *Inspección*: `--view` · `--gaps`

**`/gsd-execute-phase {N}`** — `--wave N` (solo una wave) · `--gaps-only` (solo lo que falta) · `--interactive` (confirma entre pasos) · `--tdd`

**`/gsd-discuss-phase {N}`** — `--all` (todas las gray areas de golpe) · `--chain` (discuss→plan→execute sin paradas) · `--assumptions` (aflora supuestos) · `--power` (profundo) · `--analyze` · `--batch` · `--auto` · `--text`

## Comandos consolidados (limpieza de 1.41.0)

Si tu memoria devuelve un comando que ya no existe:

| Antes | Ahora |
|-------|-------|
| `/gsd-do "{t}"` | `/gsd-progress --do "{t}"` |
| `/gsd-next` | existe otra vez como skill propia desde 1.7.0 (smart entry). `/gsd-progress --next` sigue siendo válido |
| `/gsd-note`/`-plant-seed`/`-add-todo`/`-check-todos`/`-add-backlog` | `/gsd-capture` sin flag (todo) o `--note|--seed|--list|--backlog` |
| `/gsd-scan` / `/gsd-intel` | `/gsd-map-codebase --fast|--query` |
| `/gsd-sync-skills` / `/gsd-reapply-patches` | `/gsd-update --sync|--reapply` |
| `/gsd-code-review-fix` | `/gsd-code-review --fix` |
| `/gsd-sketch-wrap-up` / `/gsd-spike-wrap-up` | `/gsd-{sketch\|spike} --wrap-up` |
| `/gsd-add-phase\|insert\|remove\|edit` | `/gsd-phase` sin flag (add) o `--insert\|--remove\|--edit` |
| `/gsd-new-workspace\|list\|remove` | `/gsd-workspace --new\|--list\|--remove` |
| `/gsd-settings-{advanced\|integrations\|set-profile}` | `/gsd-config --advanced\|--integrations\|--profile` |

## Verbos posicionales (no llevan guiones)

Estas sí usan subcomando posicional, no flag:

- `/gsd-surface list|status|profile <name>|disable <cluster>|enable <cluster>|reset`
- `/gsd-graphify build|query <term>|status|diff`
- `/gsd-thread list [--open|--resolved] | close <slug> | status <slug>`
- `/gsd-debug list | status <slug> | continue <slug>` (+ `--diagnose`)
- `/gsd-quick list | status <slug> | resume <slug>` (+ `--full`, `--validate`, `--discuss`, `--research`)
- `/gsd-help --brief | --full | <topic>`

## Otros que se olvidan

- `/gsd-undo --last N | --phase NN | --plan NN-MM` (revert con chequeo de dependencias)
- `/gsd-audit-fix --source <audit-uat> [--severity medium|high|all] [--max N] [--dry-run]`
- `/gsd-import --from <filepath> | --from-gsd2`
- `/gsd-health --repair` (además de `--context`)
- `/gsd-verify-work {N} --ws <name>` y `/gsd-new-milestone --ws <name> --reset-phase-numbers` aceptan workstream
- `/gsd-review --phase N` y `/gsd-plan-review-convergence {N} --max-cycles N`: ambas aceptan el CLI externo como flag (`--claude`, `--codex`, `--cursor`, `--qwen`, `--opencode`, `--agy`, `--all`; convergence añade `--coderabbit`, `--ollama`, `--lm-studio`, `--llama-cpp`, `--kimi-code`)
