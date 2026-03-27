---
name: kw-stack-audit
description: >
  Audita la configuracion de calidad del stack de un proyecto frontend (TypeScript,
  formatter, tipos Supabase, consistencia de librerias, seguridad de tipos en codigo,
  constantes/secretos hardcodeados, testing). Usa esta skill cuando el usuario quiera
  revisar o mejorar la base de un proyecto, detectar deuda tecnica de tooling, preparar
  un proyecto para TDD/Superpowers, o al iniciar un proyecto nuevo para asegurar la
  configuracion base estricta desde el dia 1. Triggers: "revisar el stack",
  "stack audit", "audit", "configurar TypeScript estricto", "anadir Biome",
  "detectar inconsistencias", "mejorar la base del proyecto".
  Presenta hallazgos primero y espera aprobacion antes de aplicar cambios.
---

# Stack Audit

Auditoria interactiva del stack de calidad de un proyecto frontend.
Analiza, propone y aplica cambios **solo con aprobacion explicita** del usuario.

## Filosofia

- Auditar primero, cambiar despues. Nunca aplicar cambios sin confirmacion.
- Cada bloque de cambios se presenta por separado y se aprueba individualmente.
- Respetar decisiones existentes del proyecto (si hay Prettier, no proponer Biome).
- Distinguir entre proyecto nuevo y existente: la severidad de las reglas cambia.
- No instalar testing: reportar el gap y documentar que necesita Superpowers.

---

## Pre-flight — detectar contexto antes de empezar

Antes de cualquier analisis:

1. **Detectar package manager:** buscar `bun.lockb` -> bun, `pnpm-lock.yaml` -> pnpm,
   `package-lock.json` -> npm. Usar el correcto en todos los comandos posteriores.

2. **Detectar madurez del proyecto:**
   - Contar archivos `.tsx` y `.ts` en `src/` (excluyendo `node_modules` y tipos autogenerados).
   - Si hay < 15 archivos de codigo -> **proyecto nuevo**. Severidad: `error` para reglas de tipos.
   - Si hay >= 15 archivos -> **proyecto existente**. Severidad: `warn` para reglas de tipos
     (migracion progresiva).
   - Reportar: "Proyecto detectado como **nuevo/existente** (N archivos en src/).
     Las recomendaciones se ajustan a este contexto."

3. **Leer CLAUDE.md** si existe en la raiz del proyecto: puede contener convenciones
   o restricciones que afecten las recomendaciones.

---

## Fase 1: Analisis — leer sin tocar nada

Inspeccionar estos ficheros si existen:

- `package.json` — dependencias, devDependencies, scripts
- `tsconfig.json` y `tsconfig.app.json` — opciones del compilador
- `.eslintrc.*` o `eslint.config.*` — configuracion de linting
- `.prettierrc.*` o `biome.json` — formatter
- `vitest.config.*`, `jest.config.*` — test runner
- `.env`, `.env.example`, `.env.local` — variables de entorno

Ademas, ejecutar estos conteos (grep con `output_mode: "count"` o equivalente):

- `as any` en `src/` -> indicador de type safety real
- `@ts-ignore` y `@ts-expect-error` en `src/` -> supresiones de tipos
- `// eslint-disable` y `// biome-ignore` en `src/` -> supresiones de linter
- `console.log` y `console.error` en `src/` -> logs sin centralizar

---

## Fase 2: Generar informe de hallazgos

Presentar seccion por seccion:

### 2.1 TypeScript

**Opciones criticas desactivadas** (buscar en tsconfig.json y tsconfig.app.json):

- `strict: false` o ausente — "No activa ninguna comprobacion estricta. Raiz de todos los
  problemas de tipos."
- `strictNullChecks: false` o ausente — "TypeScript no avisa cuando algo puede ser null.
  Fuente principal de crashes en runtime con datos de Supabase."
- `noImplicitAny: false` o ausente — "Permite `any` implicito en parametros y variables
  sin tipo explicito."
- `noUnusedLocals: false` — "Permite acumulacion de variables muertas sin aviso."
- `noUnusedParameters: false` — "Permite parametros de funcion que nadie usa."

Para cada opcion desactivada, explicar en una linea que riesgo concreto tiene.

**Metricas de type safety real** (de los conteos de Fase 1):

- Reportar total de `as any`, `@ts-ignore`, `@ts-expect-error`.
- Listar los 5 archivos con mas incidencias.
- Ejemplo: "Se detectaron 176 usos de `as any` en src/. Los archivos mas afectados:
  analyticsService.ts (46), rrhhService.ts (12), ..."

**Propuesta de cambios:** mostrar diff exacto de tsconfig.

**Para proyectos existentes — NUNCA activar `strict: true` directamente:**

Activar strict de golpe en un proyecto con codigo existente rompe todo. La skill debe:

1. Reportar cuantos errores generaria (`npx tsc --noEmit --strict 2>&1 | tail -1`).
2. Recomendar la estrategia gradual por fases, en este orden:
   - **Fase A:** `noUnusedLocals` + `noUnusedParameters` (limpieza de codigo muerto, bajo riesgo)
   - **Fase B:** `strictNullChecks` (el de mayor impacto real, previene crashes con datos de Supabase)
   - **Fase C:** `noImplicitAny` (fuerza tipar todo lo que hoy es `any` implicito)
   - **Fase D:** `strict: true` (activa todo lo anterior + strictBindCallApply, strictFunctionTypes, etc.)
3. Preguntar al usuario:

> En este proyecto activar `strict` de golpe generaria ~N errores de TypeScript.
> La recomendacion es ir por fases, activando una flag cada vez y corrigiendo
> los errores antes de pasar a la siguiente. Cada fase se hace en su propia rama.
>
> Orden recomendado:
> 1. `noUnusedLocals` + `noUnusedParameters` (limpieza rapida, bajo riesgo)
> 2. `strictNullChecks` (el mas valioso, previene null crashes)
> 3. `noImplicitAny` (elimina any implicitos)
> 4. `strict: true` (activar todo junto una vez que las anteriores estan limpias)
>
> ¿Quieres empezar por la fase 1, o prefieres otro enfoque?

**Para proyectos nuevos:** proponer directamente `strict: true` + `noUncheckedIndexedAccess: true`.
Sin pregunta — es la unica opcion correcta desde el dia 1.

---

### 2.2 Formatter y Linter

Detectar situacion actual:

- Si hay `biome.json` -> formatter ya configurado, reportar version y reglas activas.
- Si hay `.prettierrc.*` -> formatter ya configurado, no proponer cambio a Biome.
- Si hay ESLint sin formatter -> reportar gap de formatting.
- Si no hay nada -> reportar gap completo.

**Si no hay formatter**, preguntar al usuario:

> No hay formatter configurado. ¿Prefieres Biome (reemplaza ESLint + Prettier en uno,
> mas rapido) o Prettier (mas familiar, compatible con ESLint existente)?

**Si el usuario elige Biome Y existe ESLint**, gestionar la transicion:

1. Listar paquetes de ESLint instalados (eslint, plugins, configs).
2. Identificar reglas custom de ESLint que tengan equivalente en Biome.
3. Identificar reglas sin equivalente (si las hay, avisar antes de migrar).
4. Proponer: desinstalar paquetes ESLint + eliminar config + instalar Biome.
5. Mostrar el listado completo de paquetes a desinstalar.

**Config Biome recomendada** (usar como base, NO depender de `npx biome init`):

Para proyecto **nuevo** (severity: error):

```jsonc
{
  "organizeImports": { "enabled": true },
  "linter": {
    "enabled": true,
    "rules": {
      "recommended": true,
      "suspicious": {
        "noExplicitAny": "error"
      },
      "correctness": {
        "noUnusedVariables": "error",
        "noUnusedImports": "error",
        "useExhaustiveDependencies": "warn"
      },
      "style": {
        "noNonNullAssertion": "warn"
      }
    }
  },
  "formatter": {
    "enabled": true,
    "indentStyle": "space",
    "indentWidth": 2,
    "lineWidth": 100
  },
  "javascript": {
    "formatter": {
      "quoteStyle": "single",
      "semicolons": "always",
      "trailingCommas": "all"
    }
  },
  "files": {
    "ignore": ["dist", "node_modules"]
  }
}
```

Para proyecto **existente**: cambiar `noExplicitAny` a `"warn"` y `noUnusedVariables` a `"warn"`.

Si el proyecto tiene archivos autogenerados (como tipos Supabase), anadir su path a `files.ignore`.

---

### 2.3 Tipos Supabase — Schema Drift

**Solo aplica si el proyecto usa Supabase.** Detectar buscando `@supabase/supabase-js`
en `package.json`. Si no usa Supabase, marcar como N/A y saltar.

**Paso 1 — Detectar GenTypes:**

- Buscar archivo de tipos generados: `src/integrations/supabase/types.ts` o similar
  (tambien `src/types/supabase.ts`, `src/lib/database.types.ts`).
- Si no existe: reportar que no hay GenTypes configurados y recomendar `supabase gen types typescript`.

**Paso 2 — Detectar tipos manuales que duplican la DB:**

- Leer archivos en `src/types/` (u otra carpeta de tipos del proyecto).
- Para cada interface/type que parezca representar una tabla de DB, comprobar si la tabla
  equivalente existe en el archivo de GenTypes.
- Si hay duplicacion: reportar cuales interfaces manuales replican tablas existentes.

**Paso 3 — Medir el impacto:**

- Contar `as any` especificamente en archivos de `src/services/` — es donde el schema drift
  se manifiesta con mas fuerza.
- Buscar patrones como `(variable as any).campo` que indican campos no tipados.

**Reportar:**

> Se detectaron N interfaces manuales en src/types/ que replican tablas de la DB
> ya cubiertas por los GenTypes de Supabase. Esto causa schema drift: cuando se
> anade un campo a la DB y se regeneran los tipos, las interfaces manuales no se
> actualizan y fuerzan `as any`.
>
> Patron recomendado — derivar tipos directamente del schema generado:
>
> ```typescript
> import type { Database } from '@/integrations/supabase/types';
> type Tables = Database['public']['Tables'];
> export type Empleado = Tables['rrhh_empleados']['Row'];
> export type EmpleadoInsert = Tables['rrhh_empleados']['Insert'];
> ```

**No aplicar cambios automaticamente en esta seccion.** Es una migracion que requiere
revision manual archivo por archivo. Solo reportar el gap y proponer el patron.

---

### 2.4 Consistencia de librerias

Detectar duplicidades y conflictos. Para cada categoria, buscar en `package.json`
y reportar **solo si hay conflicto**:

**Toast / notificaciones:**
- Buscar coexistencia de `sonner`, `@radix-ui/react-toast`, `react-hot-toast`, `react-toastify`.
- Si coexisten: grep en `src/` para mostrar que componentes usan cada uno.
- Recomendar estandarizar en `sonner` (mas simple, sin provider).

**Date libraries:**
- Buscar coexistencia de `date-fns`, `dayjs`, `moment`, `luxon`.

**Icon libraries:**
- Buscar coexistencia de `lucide-react`, `react-icons`, `@heroicons/react`, `@phosphor-icons/react`.

**Form libraries:**
- Buscar coexistencia de `react-hook-form` y `formik`.

**HTTP / fetch:**
- Buscar coexistencia de `axios` con fetch nativo (`fetch(` en `src/`).

**State management:**
- Buscar coexistencia de `@tanstack/react-query` con `swr`, `@apollo/client`.
- Buscar coexistencia de `zustand`, `redux`, `jotai`, `valtio`.

**Routing:**
- Buscar coexistencia de `react-router-dom` con `wouter`, `@tanstack/react-router`.

**Styling:**
- Buscar coexistencia de `tailwindcss` con `styled-components`, `@emotion/react`,
  CSS modules (archivos `*.module.css` en `src/`).

Para cada inconsistencia: mostrar ficheros afectados (grep) antes de proponer nada.
Si una categoria esta limpia, reportar como pass.

---

### 2.5 Constantes y seguridad

**Secretos y URLs hardcodeadas:**

- Buscar patrones en `src/` (excluyendo `node_modules`, `dist`, archivos autogenerados):
  - URLs: `https://` en strings (excepto comentarios e imports)
  - Keys: patrones como `sk_`, `pk_`, `key=`, `secret`, `password`, `token` en strings
  - Supabase URLs o anon keys fuera de `.env` o archivos de config
- Si se encuentran: listar archivo y linea.
- Recomendar mover a variables de entorno.

**Constantes duplicadas:**

- Buscar definiciones de la misma constante en multiples archivos (patron: `const NOMBRE =`
  con el mismo valor en mas de un archivo).
- Si se detectan: proponer centralizar en `src/lib/constants.ts`.

**Chequeo de .env:**

- Si existe `.env` pero no `.env.example`: reportar que falta el template.
- Si `.env` esta en `.gitignore`: bien.
- Si `.env` NO esta en `.gitignore`: reportar riesgo.

---

### 2.6 Testing

Detectar situacion:

- Buscar `vitest`, `jest`, `@testing-library/react` en `package.json`.
- Buscar ficheros `*.test.*` o `*.spec.*` en `src/`.
- Buscar script `test` en `package.json`.

**Si no hay runner instalado:**

> Sin test runner configurado. Superpowers necesita un runner instalado para
> el ciclo RED-GREEN-REFACTOR. Para el stack Vite + React + TypeScript,
> la opcion natural es Vitest + React Testing Library.
> Esta skill no instala testing — es una decision que conviene tomar
> junto con la configuracion de Superpowers.

**Si hay runner pero cero tests:**

> Runner instalado pero sin ficheros de test. Los archivos de mayor valor
> para empezar son las utilidades puras en `src/lib/` y los servicios
> sin dependencia de UI.

**No instalar ni configurar nada de testing.** Solo reportar.

---

## Fase 3: Presentar resumen ejecutivo

Despues del analisis completo, mostrar tabla resumen:

```
Area                  Estado           Accion propuesta
-------------------------------------------------------------------
TypeScript config     [status]         Activar strict (+ flags)
Type safety real      [status] (N any) Reducir as any (N incidencias)
Formatter             [status]         Instalar Biome / ya configurado
Supabase types        [status]         Migrar a derivacion de GenTypes
Libs consistencia     [status]         Estandarizar duplicidades
Constantes/seguridad  [status]         Centralizar / mover a .env
Testing               [status]         (pendiente con Superpowers)
```

Luego preguntar:

> ¿Por que area quieres empezar? Podemos ir una a una.
> Te mostrare los cambios exactos antes de aplicar cualquier cosa.

---

## Fase 4: Aplicar cambios (solo con aprobacion)

Para cada area aprobada:

### TypeScript

1. Mostrar diff exacto de `tsconfig.json` y `tsconfig.app.json`.
2. Esperar confirmacion.
3. Aplicar cambios.
4. Ejecutar `npx tsc --noEmit` para mostrar cuantos errores genera.
5. Si proyecto existente: preguntar si corregir ahora o en rama separada.

### Formatter (Biome)

1. Si existe ESLint, mostrar lista de paquetes a desinstalar y config a eliminar.
2. Mostrar paquete a instalar: `@biomejs/biome`.
3. Mostrar el `biome.json` completo que se creara (de seccion 2.2, ajustado a madurez del proyecto).
4. Mostrar scripts que se anadiran/modificaran en `package.json`:
   ```json
   "lint": "biome check .",
   "lint:fix": "biome check --fix .",
   "format": "biome format --write ."
   ```
5. Esperar confirmacion.
6. Ejecutar instalacion, crear config, actualizar scripts, eliminar ESLint si aplica.
7. Preguntar si ejecutar el formatter sobre el codigo existente.

### Supabase Types

1. Mostrar ejemplo concreto del proyecto: interface manual vs GenType equivalente.
2. Mostrar el patron de migracion (archivo helper con type aliases derivados).
3. Avisar que la migracion es manual y archivo por archivo.
4. No aplicar automaticamente — crear el archivo helper y documentar que migrar.

### Estandarizacion de librerias

1. Mostrar ficheros afectados (grep results).
2. Mostrar ejemplo de migracion antes/despues en un fichero representativo.
3. Esperar confirmacion.
4. Aplicar el cambio en todos los ficheros.
5. Verificar build (`npm run build` o equivalente).

### Constantes

1. Mostrar constantes a centralizar y su ubicacion actual.
2. Mostrar el archivo `src/lib/constants.ts` propuesto.
3. Esperar confirmacion.
4. Crear archivo y actualizar imports.

---

## Reglas generales

- Nunca ejecutar install sin mostrar el comando exacto al usuario primero.
- Nunca modificar ficheros sin mostrar el diff antes.
- Si una seccion no tiene problemas, reportarlo explicitamente como pass para que
  el usuario sepa que se reviso.
- Si hay CLAUDE.md, respetar las convenciones que define.
- No proponer cambios en archivos autogenerados (tipos Supabase, componentes shadcn/ui).
- Al reportar metricas de `as any`, excluir archivos autogenerados y `node_modules`.
