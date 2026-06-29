# Site Starter

Bare-bones, production-ready starter for simple presentation websites and portfolios.

## Stack

- Next.js App Router with static export (`output: "export"`)
- Tailwind CSS
- TypeScript + ESLint

## Scripts

- `npm run dev` - run local dev server
- `npm run build` - production static build
- `npm run start` - start production server mode
- `npm run lint` - lint project files
- `npm run typecheck` - check TypeScript types
- `npm run format` - verify formatting with Prettier
- `npm run check` - lint + typecheck + build

## Reproducibility

- Node version is pinned in `.nvmrc` (`22`)
- `package.json` sets `engines.node` to `22.x`
- CI-friendly quality gate is `npm run check`

## Structure

```text
public/                    static assets
src/
  app/                     routes, layout, page composition
  ui/
    components/            reusable building blocks
    sections/              page-level sections
    icons/                 icon components/assets
  content/                 typed content/config values
  lib/                     utility and constants
  styles/                  global tokens and style primitives
  types/                   shared TypeScript types
```

## Conventions

- Keep routing and metadata logic inside `src/app`.
- Keep reusable visual primitives in `src/ui/components`.
- Keep page-specific chunks in `src/ui/sections`.
- Keep copy/content in `src/content` to avoid noisy JSX.
- Prefer server components by default.
- Use client components only where browser APIs or animations are needed.

## Add a New Page

1. Create route file in `src/app`, for example `src/app/about/page.tsx`.
2. Compose the page from `src/ui/sections/*`.
3. If text/config grows, move it into `src/content/*`.

## Optional GSAP / WebGL Add-ons

This starter intentionally does not install animation libraries by default.

When needed:

1. Install only what the project requires (for example GSAP, Three.js, R3F).
2. Add animation-focused components/hooks under `src/ui/animations`.
3. Add WebGL canvases/components under `src/ui/webgl`.
4. Lazy-load heavy client modules and respect reduced-motion preferences.

This keeps the template minimal while still scaling to rich animated experiences.
