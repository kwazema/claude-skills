# GSD Core — referencia del cambio (última revisión: ago-2026, v1.10.0)

Documento centralizado sobre la transición GSD → GSD Core. Cargar solo cuando la consulta trate del cambio de nombre, la migración, las novedades o las nuevas palancas de configuración.

## Qué pasó

- El creador original (TÂCHES) abandonó el proyecto el 22-may-2026 (borró sus cuentas y vendió sus holdings del token $GSD — la comunidad lo considera un rug pull). Los colaboradores reales forkearon el proyecto **el mismo día** y lo continúan como **GSD Core** bajo la org **open-gsd**.
- Repo actual: `github.com/open-gsd/gsd-core` (MIT, sin telemetría, security audit público limpio). El repo viejo `gsd-build/get-shit-done` está archivado.
- Paquete npm actual: **`@opengsd/gsd-core`**. El viejo `get-shit-done-cc` está deprecated y congelado en 1.42.3 para siempre — su `/gsd-update` nunca ofrecerá el paquete nuevo.
- **El versionado se reseteó**: la línea nueva arrancó en 1.2.0 (may-2026); cualquier 1.x de open-gsd es MÁS NUEVA que la 1.42.3 legacy. No comparar números entre líneas.
- Cadencia real de releases: 1.6.1 (1-jul), 1.7.0 (15-jul), 1.8.0 (22-jul), 1.9.0/1.9.1 (31-jul), 1.10.0 (8-ago). Sale una minor cada 1-2 semanas, así que este doc envejece rápido: ante duda de versión, `cat ~/.claude/gsd-core/VERSION`.
- Runtime instalado en `~/.claude/gsd-core/` (antes `~/.claude/get-shit-done/`).

## Qué NO cambia

- El pipeline canónico es el mismo: discuss → plan → execute → verify → ship.
- Los ~67 comandos de 1.42.x existen todos con el mismo nombre; prefijo `/gsd-*` intacto. Ninguno eliminado ni renombrado. En 1.10.0 son **71 skills** (las dos altas desde 1.6.1 son `gsd-next` y `gsd-onboard`).
- En Claude Code el layout de skills sigue siendo **plano** (`~/.claude/skills/gsd-{nombre}/SKILL.md`) — el deep-dive de esta skill sigue funcionando igual. Los routers `gsd-ns-*` siguen siendo fallback.
- `.planning/` es 100% compatible: cero migración de proyectos. Todos los cambios de formato (bloque `coverage:` en SUMMARY.md, `prohibitions`, IDs `M-NN`) son **opt-in**.

## Novedades clave (vs 1.42.x)

- **Capabilities (1.5.0–1.6.0)** — las features opcionales (tdd, drift, gap-analysis, security, Nyquist…) son módulos declarativos con hooks. Gestión: `/gsd-config` o `gsd-tools capability list|install|remove|enable|disable|outdated|trust`. Soporta capabilities de terceros con trust gate por consentimiento + hash.
- **`/gsd-verify-work` con UAT auto-enrutado (1.6.0)** — si el SUMMARY.md lleva bloque `coverage:`, lo cubierto por tests que pasan se auto-aprueba y solo llega al humano lo que requiere juicio. SUMMARYs viejos → comportamiento anterior.
- **`/gsd-plan-phase` con drift precheck (1.6.0, on por defecto)** — avisa de codebase map obsoleto (STRUCTURE.md stale) ANTES de planificar.
- **Guard proactivo de contexto (1.6.0)** — `workflow.context_guard_mode: warn|auto|off`: ante presión de contexto en execute-phase recomienda (o ejecuta) `/gsd-pause-work`.
- **Defensa anti prompt-injection (1.6.0)** — scanner sobre output de WebFetch/WebSearch en agentes de research; opt-in `security.injection_blocking`.
- **Spec-phase con probes (1.5.0)** — edge-probe (8 categorías de edge cases) y prohibition probe (must-NOT como criterios de aceptación negativos, machine-proven).
- **Async external jobs (1.5.0)** — un step de execute puede despachar un job largo externo y quedar en `external_job_waiting`; pause/resume reconcilian sin re-despachar.
- **MemPalace (1.5.0, opt-in)** — memoria cross-session/cross-project vía MCP. Skills nuevas: `gsd-mempalace-capture` y `gsd-mempalace-recall`.
- **Modelos** — Claude Sonnet 5 es el tier `standard` desde 1.6.1; preset `anthropic-fable`; `model_policy` por fin se respeta en el runtime claude.
- **Fixes Windows** — hooks rotos por doble-quoting de rutas (1.6.1), CRLF en STATE.md, escrituras atómicas con retry, flash de consola eliminado, rutas node estables (nvm4w/fnm/mise).
- **Verificación más honesta** — el verifier ya no marca VERIFIED por mera presencia de símbolos (`PRESENT_BEHAVIOR_UNVERIFIED` → humano); una fase no avanza con verificación stale o con gaps.
## Novedades 1.7.0 → 1.10.0 (ya estables)

- **`/gsd-next`** — smart entry: detecta el estado del proyecto y rutea a la acción siguiente. Sin argumentos. Estable desde 1.7.0 (`/gsd-progress --next` sigue funcionando).
- **`/gsd-onboard`** — onboarding guiado de codebase existente (mapea, ingesta docs y prepara planning en un flujo). Flags `--fast`, `--text`. Sustituye al `map-codebase + ingest-docs` a mano.
- **Gates humanos de verdad (1.8.0)** — los checkpoints `gate="blocking-human"` ya no se auto-aprueban en execute-phase. Era el agujero que permitía a `autonomous` pasarse una parada explícita.
- **Verifier honesto (1.8.0)** — verify-phase se abstiene en verdades `backstop` no inferibles en vez de dar false-pass.
- **Tracer slice por defecto (1.8.0)** — los planes abren con una rodaja E2E verificada. Se desactiva con `/gsd-plan-phase --no-tracer`.
- **`status: halted` en SUMMARY.md (1.10.0)** — parada por diseño (un spike que responde "no" es éxito, no fallo). Propaga transitivamente por `depends_on`: los dependientes se reportan *blocked* con su causa, en vez de ofrecerse al executor.
- **Hook write-guard (1.10.0)** — `PreToolUse` que bloquea `Write` de fichero completo cuando encogería drásticamente un artefacto `.planning/` curado. Protege contra clobbers accidentales.
- **Smart zone (1.10.0)** — nueva clave `workflow.smart_zone_tokens` (default 100000) para la estimación de fases.
- **Cierre de milestone** — escribe `Status: All phases complete` en lugar del ambiguo `Milestone complete`.
- **Retirado el runtime Gemini CLI** (1.7.0) — Google lo discontinuó el 18-jun-2026. El sucesor es Antigravity CLI, que GSD ya soporta. Irrelevante si usas Claude Code.

## Dualidad de instalación (importante para documentar comandos)

GSD se puede instalar de dos formas y **el separador del comando cambia**:

- **Skills planas** (`~/.claude/skills/gsd-*/SKILL.md`) → comandos `/gsd-progress`, con **guion**. Es lo que instala `npx @opengsd/gsd-core --claude --global`.
- **Plugin de Claude Code** (`commands/gsd/*.md` + `.claude-plugin/marketplace.json`) → comandos `/gsd:progress`, con **dos puntos**.

El template `claude-md.md` de 1.10.0 genera la forma con dos puntos (`/gsd:new-project`), donde 1.6.1 generaba guion. Si un `CLAUDE.md` de proyecto trae `/gsd:profile-user` y tú tienes skills planas, es una inconsistencia cosmética del template, no un comando inexistente.

## Updates y canales

- `/gsd-update` — ya consulta `@opengsd/gsd-core`; funciona con normalidad.
- `/gsd-update --next` — canal RC (pre-releases semanales).
- Instalar/migrar a mano (forma verificada en Windows): `npx -y --package=@opengsd/gsd-core@latest -- gsd-core --claude --global`. Detecta y limpia `get-shit-done-cc` automáticamente. Después: reiniciar Claude Code y pasar `/gsd-health` en cada proyecto.
- El instalador hace **clean install** de `commands/gsd/`, `gsd-core/` y `agents/gsd-*`: los borra y los reescribe. Lo de fuera (skills propias, hooks propios, CLAUDE.md) se preserva. Los archivos tuyos que estén *dentro* de esos directorios se respaldan solos en `gsd-user-files-backup/`, y las modificaciones a ficheros de GSD van a `gsd-local-patches/` (se remergean con `/gsd-update --reapply`).

## Watch-outs

- Si la statusline muestra un `⬆ update` fantasma tras migrar: borrar `~/.cache/gsd/gsd-update-check.json`.
- Instalar siempre ≥1.6.1 (el fix de hooks de Windows entró ahí). El bug de Windows #2206 (un `.gitignore` con CRLF que contenía `.planning/` desactivaba `commit_docs` en silencio) ya está **cerrado**.
- El epic #612 (**bracket phase-ID**: sacar el milestone del token de fase) sigue **abierto y sin consumir** en 1.10.0. Los directorios de fase mantienen el formato clásico `.planning/phases/XX-nombre/XX-CONTEXT.md`. Si algún día entra, cambiarán los nombres de directorio y habrá que revisar toda skill que los construya a mano.
- `.planning/reference/` **no es un concepto de GSD** (cero referencias en todo `gsd-core`): es convención nuestra, y varias skills `kw-*` dependen de ella. GSD sí gestiona `.planning/codebase/`. No esperes que un update de GSD cree, migre o valide `reference/`.
