# Repository Guidelines

## Project Structure & Module Organization
This is a Vite + React application. Entry points are `src/main.jsx` and `src/App.jsx`, with routes in `src/routes/index.jsx`.

- `src/features/portfolio/`: portfolio page code, organized into `components/`, `hooks/`, `data/`, and `page/`.
- `src/features/admin/`: admin-facing code, split into `data/` and `presentation/`.
- `src/components/`: shared layout and common UI components.
- `src/styles/`: global and app-level CSS.
- `src/assets/`: imported assets such as SVGs and documents.
- `public/`: static files served directly, including favicon and icon sprite.

Keep feature-specific code inside its feature folder. Move UI to `src/components` only when shared across features.

## Build, Test, and Development Commands
Use npm scripts from `package.json`:

- `npm run dev`: start the Vite development server with hot module reload.
- `npm run build`: create a production build in `dist/`.
- `npm run preview`: preview the production build locally.
- `npm run lint`: run ESLint over the repository.

Run `npm install` before development if dependencies are missing.

## Coding Style & Naming Conventions
Use JavaScript ES modules and React function components. Component files use PascalCase, for example `PortfolioPage.jsx`. Hooks use the `useThing.js` pattern, such as `useHomeSection.js`. Data modules use descriptive camelCase names like `homeSectionData.js`.

Follow the existing style: two-space indentation, single quotes, no semicolons, and JSX split into small components. Keep app-wide CSS in `src/styles`.

ESLint in `eslint.config.js` applies recommended JavaScript rules, React Hooks rules, and Vite React Refresh rules.

## Testing Guidelines
No test framework or `npm test` script is currently configured. For behavior changes, run `npm run lint` and manually verify the affected route in `npm run dev`.

If tests are added, prefer colocated `ComponentName.test.jsx` or `hookName.test.js` files and add a matching `npm test` script.

## Commit & Pull Request Guidelines
This repository has no commit history yet, so there is no established convention. Use concise, imperative messages such as `Add portfolio contact section`.

Pull requests should include a short description, verification commands, and screenshots or screen recordings for visual UI changes. Link related issues when available.

## Security & Configuration Tips
Do not commit secrets or local environment files. Keep service credentials, such as Supabase keys used by `src/features/admin/data/supabase.js`, in environment variables.
