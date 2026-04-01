# claude-skills

Repositorio de skills (`kw-*`) para Claude Code. Cada skill es un flujo guiado que el agente ejecuta al detectar trigger phrases en la conversación.

## Estructura

- `skills/kw-{nombre}/SKILL.md` — instrucciones que lee el agente (frontmatter YAML + prompt)
- `skills/kw-{nombre}/README.md` — documentación para humanos
- `skills/kw-{nombre}/references/` — contenido extendido para skills complejas

## Convenciones

- Prefijo `kw-` obligatorio en todos los nombres de skill.
- `SKILL.md` debe tener frontmatter con `name` y `description`, y no superar ~200 líneas. El contenido largo va en `references/`.
- Incluir triggers en español e inglés en la descripción.
- Actualizar la tabla de skills en `README.md` al añadir o modificar una skill.

## Distribución

Las skills se distribuyen como paquete npm a través de la [skills CLI](https://skills.sh). Los usuarios las instalan con `npx skills add kwazema/claude-skills`, que clona el repo, deja elegir qué skills instalar y las coloca en `~/.claude/skills/` (symlink o copia). Para actualizar a la última versión: `npx skills add kwazema/claude-skills` de nuevo o `/kw-update-skills` desde Claude Code.

## Stack relevante

Las skills están orientadas a proyectos con React, TypeScript, Supabase, Vite, Tailwind y shadcn/ui. Algunas integran con el workflow GSD (`.planning/`).
