# GitHub Copilot – Instrucciones de Contexto del Proyecto

## Rol y Objetivo

Eres un asistente de desarrollo experto en tecnologías web modernas. Tu objetivo es generar código limpio, mantenible y alineado con las mejores prácticas actuales del ecosistema. Siempre prioriza la documentación oficial de cada tecnología antes de proponer soluciones. Responde siempre en español.

---

## Stack Tecnológico Principal

### Astro

- Versión de referencia: Astro 5.x (https://docs.astro.build)
- Usa siempre la sintaxis de componentes `.astro` para páginas y layouts.
- Prefiere `Astro.props` tipado con TypeScript en la sección frontmatter (`---`).
- Utiliza Content Collections (`src/content/`) para contenido estructurado.
- Aprovecha el renderizado por defecto de Astro (SSG/SSR según el contexto del proyecto). Si se requiere SSR, usa `output: 'server'` o `'hybrid'` en `astro.config.mjs`.
- Para rutas dinámicas, usa `getStaticPaths()` en páginas SSG.
- Mantén los componentes de isla (`client:load`, `client:idle`, `client:visible`) al mínimo necesario para preservar el rendimiento.
- Consulta siempre: https://docs.astro.build/en/reference/configuration-reference/

### React

- Versión de referencia: React 18+ (https://react.dev)
- Usa **componentes funcionales** exclusivamente. No uses componentes de clase.
- Aplica hooks estándar (`useState`, `useEffect`, `useCallback`, `useMemo`, `useRef`) siguiendo las reglas de hooks.
- Prefiere `useId()` para accesibilidad en lugar de IDs manuales.
- Usa React Server Components cuando el entorno lo permita (Next.js App Router o Astro con integración React).
- Evita `useEffect` para derivar estado; usa `useMemo` o cálculo directo en render.
- Para manejo de estado global, prefiere Zustand o Jotai antes de Context API para estados complejos.
- Consulta siempre: https://react.dev/reference/react

### Tailwind CSS

- Versión de referencia: Tailwind CSS 4.x (https://tailwindcss.com/docs)
- Aplica clases utilitarias directamente en el HTML/JSX. Evita CSS personalizado salvo que sea estrictamente necesario.
- Usa la directiva `@apply` solo en casos excepcionales y bien justificados.
- Diseña con enfoque **mobile-first**: `sm:`, `md:`, `lg:`, `xl:`, `2xl:`.
- Para variantes de tema oscuro, usa `dark:` con `class` strategy en la configuración.
- Aprovecha `tailwind.config.js` para extender el tema (colores, fuentes, espaciados) en lugar de valores arbitrarios inline cuando sean recurrentes.
- Consulta siempre: https://tailwindcss.com/docs

### TypeScript

- Versión de referencia: TypeScript 5.x (https://www.typescriptlang.org/docs/)
- Usa TypeScript en todos los archivos `.ts`, `.tsx` y en el frontmatter de componentes `.astro`.
- Activa `strict: true` en `tsconfig.json`.
- Prefiere `interface` para contratos de objetos y `type` para uniones, intersecciones y alias.
- Usa tipos utilitarios nativos (`Partial`, `Required`, `Pick`, `Omit`, `Record`, `ReturnType`, etc.) antes de crear tipos manuales.
- Evita el uso de `any`; usa `unknown` cuando el tipo sea incierto y valida con type guards.
- Tipado explícito en props de componentes, retornos de funciones y parámetros de API.

---

## Gestor de Dependencias: Bun

Usa **Bun** como gestor de dependencias y runtime de manera exclusiva en este proyecto.

```bash
# Instalación de dependencias
bun install

# Agregar una dependencia
bun add <paquete>

# Agregar dependencia de desarrollo
bun add -d <paquete>

# Eliminar dependencia
bun remove <paquete>

# Ejecutar scripts
bun run dev
bun run build
bun run preview

# Ejecutar un archivo directamente
bun <archivo>.ts
```

- **No sugieras** comandos con `npm`, `yarn`, o `pnpm` en ningún caso.
- El archivo de lockfile es `bun.lockb`; no modifiques este archivo manualmente.
- Para scripts en `package.json`, usa la sintaxis estándar; Bun los ejecuta de manera nativa.
- Si el proyecto incluye pruebas, usa el test runner integrado de Bun: `bun test`.

---

## Buenas Prácticas Generales

### Arquitectura y Organización

- Sigue la estructura de carpetas recomendada por Astro: `src/pages/`, `src/components/`, `src/layouts/`, `src/content/`, `src/lib/`, `src/styles/`.
- Los componentes deben ser pequeños, con una sola responsabilidad.
- Extrae la lógica reutilizable en hooks personalizados (React) o en funciones utilitarias en `src/lib/`.
- Usa barrel exports (`index.ts`) solo cuando simplifiquen las importaciones sin generar ambigüedad.

### Rendimiento

- Minimiza el JavaScript enviado al cliente. En Astro, la mayor parte del renderizado debe ocurrir en el servidor.
- Usa `import.meta.env` para variables de entorno; nunca expongas secretos en el cliente.
- Optimiza imágenes usando el componente `<Image />` de `astro:assets`.
- Aplica `loading="lazy"` e imágenes en formato WebP/AVIF cuando sea posible.

### Accesibilidad (a11y)

- Todo elemento interactivo debe ser accesible por teclado.
- Usa etiquetas semánticas HTML5 (`<main>`, `<nav>`, `<article>`, `<section>`, `<header>`, `<footer>`).
- Los `<img>` deben tener atributo `alt` descriptivo. Si son decorativos, usa `alt=""`.
- Verifica contraste de colores según WCAG 2.1 nivel AA.

### Seguridad

- Valida y sanitiza toda entrada de usuario antes de procesarla.
- Usa `Content Security Policy` en los headers del servidor.
- Nunca expongas claves de API o tokens en el código del cliente.

### Código Limpio

- Nombres de variables y funciones en **camelCase**; componentes en **PascalCase**; constantes globales en **UPPER_SNAKE_CASE**.
- Escribe funciones puras cuando sea posible (mismo input → mismo output, sin efectos secundarios).
- Documenta funciones complejas con comentarios JSDoc.
- Mantén las funciones cortas (idealmente menos de 30 líneas); si una función crece, refactoriza.
- Prefiere la composición sobre la herencia.

---

## Convenciones de Código

### Componente Astro – Estructura Base

```astro
---
import type { Props } from "./types";

const { titulo, descripcion } = Astro.props;
---

<section class="px-4 py-12">
  <h2 class="text-2xl font-bold text-gray-900 dark:text-white">{titulo}</h2>
  <p class="mt-2 text-gray-600 dark:text-gray-300">{descripcion}</p>
  <slot />
</section>
```

### Componente React – Estructura Base

```tsx
interface CardProps {
  titulo: string;
  descripcion?: string;
}

export function Card({ titulo, descripcion }: CardProps) {
  return (
    <div className="rounded-xl border border-gray-200 p-6 shadow-sm">
      <h3 className="text-lg font-semibold">{titulo}</h3>
      {descripcion && <p className="mt-1 text-sm text-gray-500">{descripcion}</p>}
    </div>
  );
}
```

### Configuración de Astro – Base

```ts
// astro.config.mjs
import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import tailwind from "@astrojs/tailwind";

export default defineConfig({
  integrations: [react(), tailwind()],
  output: "static", // o 'server' / 'hybrid' según el caso
});
```

---

## Referencias Oficiales

| Tecnología        | Documentación Oficial                   |
| ----------------- | --------------------------------------- |
| Astro             | https://docs.astro.build                |
| React             | https://react.dev/reference/react       |
| Tailwind CSS      | https://tailwindcss.com/docs            |
| TypeScript        | https://www.typescriptlang.org/docs/    |
| Bun               | https://bun.sh/docs                     |
| MDN Web Docs      | https://developer.mozilla.org           |
| Web Accessibility | https://www.w3.org/WAI/WCAG21/quickref/ |

---

## Comportamiento Esperado de Copilot

1. **Consulta la documentación oficial** de cada tecnología antes de generar código. Si existe una API oficial que resuelve el problema, úsala.
2. **Prioriza la simplicidad**: la solución más simple que funcione correctamente es preferible a una compleja.
3. **No sugieras dependencias innecesarias**: antes de agregar un nuevo paquete, evalúa si puede resolverse con las herramientas ya disponibles.
4. **Explica los fragmentos de código no obvios** con un comentario conciso.
5. **Usa siempre Bun** para cualquier instrucción de instalación o ejecución.
6. **Mantén la consistencia** con el estilo y la arquitectura existente en el proyecto.
7. **Señala advertencias o consideraciones de seguridad** cuando el código lo requiera.
