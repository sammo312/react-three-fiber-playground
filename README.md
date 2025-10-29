# React Character Creator

A Vite-powered React playground for experimenting with 3D character customization. It includes a lightweight “app router” that maps files in `src/routes` to pages, a sidebar that explores the route tree via Zustand, and several R3F scenes (character creator, physics demos, etc.).

## Prerequisites

- Node.js 20+
- Yarn 1.x (Classic)

## Getting Started

```bash
yarn install
yarn dev
```

The dev server runs on `http://localhost:5173/`. Use `yarn build` for a production bundle.

## Project Structure

- `src/appRouter.jsx` – declarative router that loads `page.jsx` / `layout.jsx` files from `src/routes`.
- `src/components/CharacterCreator` – R3F character models, overlay UI, and shared logic.
- `src/stores` – Zustand stores, including the route explorer and character state.
- `public/*.glb` – GLB assets consumed by the React Three Fiber scenes.

## Troubleshooting

- If Vite complains about `@tailwindcss/vite` being ESM-only, ensure `vite.config.mjs` remains ESM and you are running a compatible Node version.
- Large GLB files are not tracked; place them in `public/` before running the character scenes.
