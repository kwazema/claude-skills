# VersionBadge — contrato funcional

Componente UI opcional que muestra la versión inyectada en build. **La skill NO genera este componente automáticamente** — solo deja preparadas las env vars (`APP_VERSION`, `APP_COMMIT_SHORT`, `APP_BUILD_TIME`) en `@/lib/app-version.ts`.

Si el usuario quiere un badge visible, el LLM lo genera bajo demanda adaptándose al stack detectado en el proyecto. Este documento define el contrato.

## Cuándo generarlo

El usuario lo pide explícitamente tras el checkpoint ("quiero también un badge", "añade un componente que muestre la versión", etc.). Si no lo pide, no se genera.

## Contrato funcional

El componente debe:

1. Mostrar inline: `v{APP_VERSION} · {APP_COMMIT_SHORT}` (los 7 primeros caracteres del SHA).
2. En hover/focus: tooltip con la fecha de build formateada legible (idioma del proyecto).
3. Al click: copiar al portapapeles un string del tipo `v{version} ({commit}) - {fecha}` y mostrar un toast de confirmación.
4. Degradado graceful: si `APP_BUILD_TIME` no es parseable, oculta la fecha pero sigue mostrando versión + commit.
5. Sin import directo de `import.meta.env` — siempre via `@/lib/app-version.ts`.

## Detección de stack

Antes de generar, el LLM inspecciona `package.json` y `src/components/ui/` para determinar:

- **UI primitives**: shadcn/ui (buscar `@/components/ui/tooltip.tsx`), Radix directo, Chakra UI, Mantine, Headless UI, Tailwind puro, CSS modules, etc.
- **Toast**: Sonner, react-hot-toast, react-toastify, `useToast` de Chakra/Mantine, o nada (usar `alert()` como último recurso).
- **Formateo de fechas**: `date-fns` (¿tiene locale instalado?), `dayjs`, `luxon`, o `Intl.DateTimeFormat` nativo.
- **Iconos**: `lucide-react`, `@hugeicons/react`, `react-icons`, inline SVG, o ninguno.
- **Utility de className**: `cn` en `@/lib/utils`, `clsx`, `classnames`, o concatenación nativa.

Genera el componente usando las piezas que encuentre. Si falta algo crítico (p.ej. no hay sistema de tooltip), usa el fallback nativo (`title=""`) y lo indica en un comentario inline una línea.

## Adaptaciones por stack

### shadcn/ui + Sonner + date-fns + Hugeicons (Kontevo)

Usa `Tooltip` + `TooltipContent` + `TooltipTrigger` de `@/components/ui/tooltip`, `toast.success` de `sonner`, `format` + `parseISO` de `date-fns` con locale, `HugeiconsIcon`. Referencia: el badge original de Kontevo.

### shadcn/ui + Sonner + Intl nativo

Idéntico al anterior, pero formatea fecha con `new Intl.DateTimeFormat(navigator.language, { dateStyle: 'medium', timeStyle: 'short' }).format(date)`.

### Tailwind puro sin UI lib

- Tooltip: `<button title={tooltipText}>` (nativo del navegador) O un tooltip custom minimal (div absolute con opacity en hover).
- Toast: Si no hay ninguno instalado, usa `alert()` O no muestres toast y solo cambia el estado visual del botón por 1 seg ("Copiado ✓").
- Clases: compone con Tailwind directo. Sin `cn` helper si no existe.

### Chakra UI

`Tooltip` de `@chakra-ui/react`, `useToast()`, `Intl` nativo para fecha.

### Mantine

`Tooltip` de `@mantine/core`, `notifications.show()` de `@mantine/notifications` si está instalado.

## Ejemplo mínimo (sin ninguna librería UI)

```tsx
import { useState } from 'react';
import { APP_VERSION, APP_COMMIT_SHORT, APP_BUILD_TIME } from '@/lib/app-version';

export function VersionBadge() {
  const [copied, setCopied] = useState(false);
  const badgeText = `v${APP_VERSION} · ${APP_COMMIT_SHORT}`;

  let tooltipText = badgeText;
  try {
    const date = new Date(APP_BUILD_TIME);
    if (!Number.isNaN(date.getTime())) {
      tooltipText = `Deployed ${date.toLocaleString()}`;
    }
  } catch {
    /* fallback */
  }

  async function handleCopy() {
    await navigator.clipboard.writeText(badgeText);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      title={tooltipText}
      className="text-xs text-gray-500 hover:text-gray-700"
    >
      {copied ? 'Copied ✓' : badgeText}
    </button>
  );
}
```

## Montaje

**No lo montes automáticamente.** Al generar el componente, imprime al usuario:

> Badge generado en `src/components/version-badge.tsx`. Monta `<VersionBadge />` donde prefieras (footer del sidebar, esquina del header, página /about, etc.). Queda a tu criterio.
