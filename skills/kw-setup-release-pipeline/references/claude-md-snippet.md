Sección a añadir (o mergear) al `CLAUDE.md` del proyecto tras instalar el pipeline.

Copiar tal cual, ajustando el nombre del proyecto si procede. Si el `CLAUDE.md` ya tiene una sección "Conventional Commits", mergear en lugar de duplicar.

---

## Conventional Commits

El proyecto usa Conventional Commits validados por Commitlint + Husky local. Cada commit debe seguir el formato `tipo(scope?): descripción`. Mensajes mal formados son bloqueados por el hook `commit-msg` antes de entrar al historial.

Tipos permitidos: `feat`, `fix`, `docs`, `chore`, `refactor`, `test`, `perf`, `build`, `ci`, `style`.

Scopes libres (sin enum cerrado). Commitlint solo valida el formato, no el valor del scope.

Ejemplos válidos:
- `feat(auth): add passkey login`
- `fix(ocr): handle null counterpart_cif`
- `chore(deps): bump react to 19.3`
- `docs(readme): add setup instructions`

Template opcional: `git config commit.template .gitmessage` activa el template incluido en el repo, que muestra los tipos permitidos al editar el mensaje.

Release Please usa estos commits para generar bumps SemVer + `CHANGELOG.md` automáticamente al mergear a `main`. Solo `feat`, `fix` y `perf` aparecen en el changelog público; el resto quedan ocultos por configuración.
