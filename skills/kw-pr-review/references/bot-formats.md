# Bot formats reference

Parseo y normalización de comentarios por bot de revisión. Editar este archivo para añadir nuevos bots — la skill `kw-pr-review` los consumirá automáticamente.

## Schema normalizado

Todos los findings se reducen a este shape antes del análisis:

```
{
  source: "codex" | "coderabbit" | "cubic" | "sourcery",
  severity: "P1" | "P2" | "P3" | "info",
  path: string | null,
  line: number | null,
  title: string,
  description: string,
  url: string
}
```

`severity` semántica:
- `P1` — bug real con impacto en datos / runtime / seguridad
- `P2` — refactor con beneficio claro (mantenibilidad, performance medible)
- `P3` — nitpick / estilo / sugerencia menor
- `info` — comentario top-level informativo (summary, walkthrough)

────────────────────────────────────────────────────────────

## Codex — `chatgpt-codex-connector[bot]`

**Endpoints**:
- `/pulls/{n}/comments` — inline (todos los findings reales)
- `/pulls/{n}/reviews` — review padre (banner informativo, ignorar)

**Estructura del body** (markdown):
```
**<sub><sub>![P1 Badge](https://img.shields.io/badge/P1-orange?style=flat)</sub></sub>  <Título>**

<descripción técnica del problema>

Useful? React with 👍 / 👎.
```

**Parseo**:
- `severity` — extraer de `!\[P([123]) Badge\]` en el body (regex). Si no hay badge → ignorar (es el banner).
- `title` — texto en negrita inmediatamente después del badge (hasta `**`).
- `description` — todo entre el título y `Useful? React with` (trim).
- `path`, `line` — campos `path` y `line` (o `original_line`) del comentario.
- `url` — `html_url` del comentario.

**Filtros**:
- Ignorar comentarios sin badge (banner "💡 Codex Review" en reviews padre).

────────────────────────────────────────────────────────────

## CodeRabbit — `coderabbitai[bot]`

**Endpoints**:
- `/pulls/{n}/comments` — inline (findings line-by-line)
- `/issues/{n}/comments` — summary + walkthrough top-level

**Estructura del body inline**:
```
_⚠️ Potential issue_ | _🛠️ Refactor suggestion_ | _🧹 Nitpick (assertive)_

**<Título>**

<descripción>

<details>
<summary>📝 Committable suggestion</summary>
...diff sugerido...
</details>
```

**Mapeo de severidad**:
| Prefijo | Severity |
|---------|----------|
| `⚠️ Potential issue` | `P1` |
| `🛠️ Refactor suggestion` | `P2` |
| `📝 Committable suggestion` | `P2` |
| `🧹 Nitpick` | `P3` |
| `💡 Verification agent` | `info` |

**Parseo**:
- `severity` — primer match del prefijo (case-insensitive en el emoji + texto).
- `title` — primera línea en negrita tras el prefijo.
- `description` — resto del body hasta el primer `<details>` (excluir el diff sugerido, queda como referencia en `url`).
- Si el body es del `/issues/{n}/comments` endpoint → severity `info`, `path: null`, `line: null`.

**Filtros**:
- Ignorar comentarios `Review skipped` (PR excede límite de archivos del plan free).
- Ignorar tips boilerplate (`<!-- This is an auto-generated comment -->`).

────────────────────────────────────────────────────────────

## Cubic — `cubic-dev-ai[bot]`

**Estado**: TBD. Si el usuario migra Cubic al modo GitHub-native (en lugar del flujo de pegar texto), documentar aquí el formato real. Para output pegado como texto, usar la skill `kw-cubic`.

**Plantilla esperada** (a confirmar):
- Endpoint: `/pulls/{n}/comments` inline
- Severidad: probablemente `severity` enum en metadata o prefijo

────────────────────────────────────────────────────────────

## Sourcery — `sourcery-ai[bot]`

**Endpoints**:
- `/pulls/{n}/reviews` — review padre con summary
- `/pulls/{n}/comments` — inline findings

**Mapeo de severidad** (Sourcery usa categorías propias):
| Categoría | Severity |
|-----------|----------|
| `Issue (Bug Risk)` | `P1` |
| `Issue` | `P2` |
| `Suggestion` | `P2` |
| `Question` | `P3` |

**Parseo**:
- `severity` — extraer la categoría del primer header del body.
- `title` — primera línea tras la categoría.
- `description` — resto del body.

────────────────────────────────────────────────────────────

## Whitelist de reviewers reconocidos

Lista de logins que cuentan como reviewers (la skill los procesa):

```
chatgpt-codex-connector[bot]
coderabbitai[bot]
cubic-dev-ai[bot]
sourcery-ai[bot]
```

Para añadir un bot custom, editar esta lista y añadir una sección de parseo arriba.

## Blacklist (ignorar siempre)

Bots de infra/CI/dependencias que no son reviewers de código:

```
vercel[bot]
supabase[bot]
netlify[bot]
dependabot[bot]
renovate[bot]
github-actions[bot]
codecov[bot]
sentry-io[bot]
```

Sus comentarios no se procesan aunque caigan en los endpoints leídos.
