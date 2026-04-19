Checkpoint humano final. La skill imprime este bloque al terminar la generación y se detiene. No continúa hasta que el usuario confirma que los tres pasos están hechos.

La URL del paso 1 se genera dinámicamente desde `git remote get-url origin`. Formato esperado: `https://github.com/{owner}/{repo}/settings/actions`.

Usuario GitHub por defecto: `Kwazema` (todos los repos personales del dev están bajo esta cuenta). Si la skill detecta un owner distinto al leer el remote, usa ese; si falla la detección, pregunta.

---

## Bloque a imprimir

```
╭─────────────────────────────────────────────────────────────╮
│  Pipeline generado. 3 acciones manuales pendientes:         │
╰─────────────────────────────────────────────────────────────╯

1. ACTIVAR WORKFLOW PERMISSIONS (crítico — sin esto el primer run falla con 403)

   Ir a: {{WORKFLOW_PERMISSIONS_URL}}

   En la sección "Workflow permissions":
   - Seleccionar [x] Read and write permissions
   - Marcar [x] Allow GitHub Actions to create and approve pull requests
   - Guardar

2. MERGEAR LA RAMA DE SETUP A {{RELEASE_BRANCH}}

   La skill ha dejado los cambios en tu working tree.
   Flujo recomendado: commit con "chore: setup release pipeline",
   push a una rama, abrir PR, merge a {{RELEASE_BRANCH}}.

3. VERIFICAR QUE EL WORKFLOW CORRE VERDE

   Ir a: https://github.com/{{OWNER}}/{{REPO}}/actions

   Tras el merge, el workflow "release-please" debe:
   - Ejecutarse sin error (run verde)
   - Abrir un PR titulado "chore({{RELEASE_BRANCH}}): release {{INITIAL_VERSION}}"

   Ese PR contiene: bump de package.json, CHANGELOG.md inicial, tag.
   Mergearlo publica la primera release.

Cuando termines los 3 pasos, la automatización queda activa:
cada push a {{RELEASE_BRANCH}} con commits convencionales generará
el próximo Release PR automáticamente.
```

## Notas para el LLM al imprimir

- Sustituye `{{WORKFLOW_PERMISSIONS_URL}}`, `{{OWNER}}`, `{{REPO}}`, `{{RELEASE_BRANCH}}` e `{{INITIAL_VERSION}}` con valores reales antes de imprimir.
- Si no puedes derivar el `OWNER` del remote (p.ej. no es un remoto GitHub), pide al usuario que te lo dé.
- No continúes a otros pasos después de imprimir esto. El checkpoint es terminal.
