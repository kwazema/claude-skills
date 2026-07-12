# GSD Core — referencia del cambio (julio 2026)

Documento centralizado sobre la transición GSD → GSD Core. Cargar solo cuando la consulta trate del cambio de nombre, la migración, las novedades o las nuevas palancas de configuración.

## Qué pasó

- El creador original (TÂCHES) abandonó el proyecto el 22-may-2026 (borró sus cuentas y vendió sus holdings del token $GSD — la comunidad lo considera un rug pull). Los colaboradores reales forkearon el proyecto **el mismo día** y lo continúan como **GSD Core** bajo la org **open-gsd**.
- Repo actual: `github.com/open-gsd/gsd-core` (MIT, sin telemetría, security audit público limpio). El repo viejo `gsd-build/get-shit-done` está archivado.
- Paquete npm actual: **`@opengsd/gsd-core`**. El viejo `get-shit-done-cc` está deprecated y congelado en 1.42.3 para siempre — su `/gsd-update` nunca ofrecerá el paquete nuevo.
- **El versionado se reseteó**: la línea nueva arrancó en 1.2.0 (may-2026); 1.6.1 (jul-2026) es MÁS NUEVA que 1.42.3. No comparar números entre líneas.
- Runtime instalado en `~/.claude/gsd-core/` (antes `~/.claude/get-shit-done/`).

## Qué NO cambia

- El pipeline canónico es el mismo: discuss → plan → execute → verify → ship.
- Los ~67 comandos de 1.42.x existen todos con el mismo nombre; prefijo `/gsd-*` intacto. Ninguno eliminado ni renombrado.
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
- **1.7.0 (canal `next`, RC)** — `/gsd-next` (smart entry: detecta estado y propone siguiente acción) y `/gsd-onboard` (onboarding brownfield guiado). En 1.6.1 el equivalente es `/gsd-progress --next` y `map-codebase + ingest-docs` respectivamente.

## Updates y canales

- `/gsd-update` — ya consulta `@opengsd/gsd-core`; funciona con normalidad.
- `/gsd-update --next` — canal RC (pre-releases semanales).
- Instalar/migrar en un dispositivo con la instalación vieja: `npx @opengsd/gsd-core@latest --claude --global` (detecta y limpia `get-shit-done-cc` automáticamente; preview con `--dry-run` añadiendo `-y --package=@opengsd/gsd-core@latest -- gsd-core` a npx). Después: reiniciar Claude Code y pasar `/gsd-health` en cada proyecto.

## Watch-outs

- Si la statusline muestra un `⬆ update` fantasma tras migrar: borrar `~/.cache/gsd/gsd-update-check.json`.
- Issue abierta #2206 (Windows): un `.gitignore` con CRLF que contenga `.planning/` hace que `commit_docs` se desactive en silencio. Revisar line endings si los commits de docs desaparecen.
- Instalar siempre ≥1.6.1 (el fix de hooks de Windows entró ahí).
