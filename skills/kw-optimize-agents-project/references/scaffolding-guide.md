# Scaffolding Guide

When AGENTS.md content needs to move to reference docs but those docs don't exist yet, create them from these templates. Each template provides structure, guidance, and TODO placeholders so the user can fill them progressively.

## Decision: when to create each doc

| Template | Create when... | Target folder |
|----------|---------------|---------------|
| SYSTEM-MAP.md | Architecture/layers/data flow sections are being moved from AGENTS.md | `.planning/reference/` |
| CODEBASE-CONVENTIONS.md | Naming, code style, import org, function design sections are being moved | `.planning/reference/` |
| STACK-DETAIL.md | Per-dependency version lists are being moved (from GSD:stack or manual) | `.planning/reference/` |

**Do NOT create if:**
- `.planning/codebase/` already has equivalent files (STACK.md, CONVENTIONS.md, ARCHITECTURE.md) — point to those instead
- The content being moved is <20 lines — leave it inline, not worth a separate doc

## Template: SYSTEM-MAP.md

Create when architecture, layers, entry points, data flow, or integration details are being moved.

```markdown
# {Project Name} — System Map

Architecture overview, data flow, and integration map. Leer cuando se necesite entender como encajan las piezas del sistema.

**Estado:** Esqueleto — rellenar progresivamente.

---

## 1. Arquitectura general

> TODO: Diagrama Mermaid de componentes principales y como se conectan.
> Incluir: frontend, backend, servicios externos, protocolos (REST, Realtime, webhook).

---

## 2. Flujo de datos principal

> TODO: Camino end-to-end del input principal del usuario hasta el output final.
> Incluir: cada paso con funcion/fichero responsable, datos de entrada y salida.

---

## 3. Modelo de datos

> TODO: Diagrama ER simplificado. Solo tablas principales, PKs, FKs, cardinalidad.
> Incluir: notas sobre RLS o seguridad por tabla.

---

## 4. Integraciones externas

> TODO: Tabla con servicio, proposito, conexion, credenciales.
> Incluir: que datos se envian/reciben, timeouts, recovery paths.

---

## 5. Mapa de paginas y rutas

> TODO: Tabla con ruta, pagina, componentes principales, hooks/services.

---

## 6. Mapa de servicios

> TODO: Tabla con fichero, funciones exportadas, responsabilidad.

---

*Documento vivo. Actualizar cuando se anadan paginas, servicios, o integraciones.*
```

## Template: CODEBASE-CONVENTIONS.md

Create when naming patterns, code style details, module design, or function design patterns are being moved.

```markdown
# {Project Name} — Codebase Conventions

Patrones de codigo, naming, estilo y organizacion. Leer cuando se necesite entender las convenciones del proyecto en detalle.

**Estado:** Esqueleto — rellenar progresivamente.

---

## 1. Naming Patterns

> TODO: Tabla con tipo de archivo/export y convencion de naming.
> Ejemplo: Components → PascalCase, hooks → useXxx camelCase, constants → SCREAMING_SNAKE_CASE.

---

## 2. Code Style

> TODO: Reglas de formato (indent, line width, quotes, semicolons).
> Incluir: herramienta usada y fichero de config.

---

## 3. Import Organization

> TODO: Orden de imports, path aliases, barrel exports.

---

## 4. Module Design

> TODO: Named vs default exports, patron de re-exports, constantes.

---

## 5. Function Design

> TODO: Tamano preferido, destructuring, return types, hooks.

---

## 6. TypeScript Strict Mode

> TODO: Flags activos en tsconfig con breve explicacion de cada uno.

---

## 7. Styling

> TODO: Utilidades CSS (cn, cva), tokens, responsive patterns.

---

*Documento vivo. Actualizar cuando cambien convenciones.*
```

## Template: STACK-DETAIL.md

Create when per-dependency version lists are being moved.

```markdown
# {Project Name} — Stack Detail

Dependencias con versiones exactas y proposito. Leer cuando se necesite verificar versiones, compatibilidad, o dependencias disponibles.

**Estado:** Esqueleto — rellenar con `npm list` o package.json.

---

## Runtime

> TODO: Node version, package manager, lockfile.

## Frameworks

> TODO: Tabla con dependencia, version, proposito.

## Database & Backend

> TODO: Servicio, version, configuracion.

## Build & Development Tools

> TODO: Herramientas de build, lint, format con versiones.

## Configuration Files

> TODO: Lista de ficheros de config y que controla cada uno.

## Platform Requirements

> TODO: Requisitos minimos para correr el proyecto.

---

*Documento vivo. Actualizar tras upgrades de dependencias.*
```

## After scaffolding

Once templates are created:
1. Add each new doc to the "Documentacion de referencia" section of AGENTS.md with a one-line description and when-to-read guidance
2. If `.planning/codebase/` exists with GSD-generated analysis, suggest the user cross-references to avoid duplication
3. Remind the user that these are starting points — fill them over time, not all at once
