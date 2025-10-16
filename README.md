git clone https://github.com/ufc-odontologia/almoxarifado-frontend.git

# Almoxarifado UFC — Frontend

This repository contains the frontend for the Almoxarifado UFC application, built with Next.js (App Router), TypeScript, Tailwind CSS and shadcn/ui primitives.

This README documents how to set up the project locally, run the development server, use the built-in API mocks, and add commitlint + Husky for consistent commits.

---

## Table of contents

- Requirements
- Quick start
- Environment variables
- Install dependencies
- Run the dev server
- Working with the local API mocks
- Authentication — login flow (dev)
- Building for production
- Formatting, linting and type checking
- Commit linting and Husky (recommended)
- Troubleshooting
- Useful commands

---

## Requirements

- Node.js 18.x or later (LTS recommended)
- npm 9.x or later (or yarn/pnpm, adjust commands accordingly)
- Git (for Husky/commit hooks)

From a Windows PowerShell terminal, make sure you have a compatible Node.js installed and that `node` and `npm` are in your PATH.

## Quick start (development)

1. Clone the repository and change to the project directory:

```pwsh
git clone <repo-url> almoxarifado-ufc-frontend
cd almoxarifado-ufc-frontend
```

If you prefer to scaffold a fresh Next.js project with the recommended options instead of cloning, run the official generator and then copy or apply this project's files on top of it. Example (scaffolds a new App Router + TypeScript + Tailwind project):

```pwsh
# create a new Next.js app using the official generator
npx create-next-app@latest almoxarifado-ufc-frontend --typescript --app --eslint --tailwind

# then change into the new folder
cd almoxarifado-ufc-frontend
```

If you cloned the repository earlier, skip the scaffolding step above.

2. Copy environment example or create `.env.local` in the project root. At minimum, set:

```env
NEXT_PUBLIC_USE_MOCKS=true
# Optional override for API URL if you use a separate backend
# NEXT_PUBLIC_API_URL=http://localhost:3001
```

3. Install dependencies:

```pwsh
npm install
```

4. Start the dev server:

```pwsh
npm run dev
```

By default the app runs on http://localhost:3000. When `NEXT_PUBLIC_USE_MOCKS=true` the frontend will call internal Next.js App Router API routes at `/api/mock/*`.

## Environment variables

- `NEXT_PUBLIC_USE_MOCKS` (true/false) — when true, the app calls built-in mock API routes under `src/app/api/mock/...`.
- `NEXT_PUBLIC_API_URL` — optional base URL for a real backend. If empty, axios is configured to use relative URLs so `/api/...` requests go to the Next.js server.

Create `.env.local` with the values you need (see quick start).

## Install dependencies (notes)

The project uses several libraries. Installing via `npm install` is enough for standard development. Key libraries included:

- next (App Router)
- react, react-dom
- typescript
- tailwindcss, postcss, autoprefixer
- shadcn/ui primitives and radix dependencies
- axios
- react-hook-form, zod, @hookform/resolvers
- zustand (persisted store)
- class-variance-authority, tailwind-merge
- lucide-react (icons)

If you add or upgrade dependencies, re-run `npm install`.

## Run the dev server

```pwsh
npm run dev
```

This starts the Next.js dev server. Open http://localhost:3000 to view the app.

If you make changes to server-side code (API routes), Next.js will reload automatically.

## Local API mocks

The project includes mock API routes using the Next.js App Router under `src/app/api/mock/`.

- `POST /api/mock/login` — mock login endpoint. In development the mock accepts any email if the password is `password` and returns a mock token and user object.
- `GET /api/mock/me` — returns the mock user when a valid mock token (`Bearer mock-token`) is present.

To use mocks:

- Set `NEXT_PUBLIC_USE_MOCKS=true` in `.env.local`.
- Start the dev server and use the app UI to login.

Notes:

- The app's axios client will use the relative `/api/...` URL when `NEXT_PUBLIC_API_URL` is not set — this ensures requests go to the Next.js app and hit the mock routes.

## Authentication — login flow (dev)

- The login form lives in `src/app/login/page.tsx`.
- On submit the frontend calls the `login` function in `src/services/auth.ts`.
- When mocks are enabled the service will POST to `/api/mock/login` and store the returned token in the Zustand store and in memory.
- For development, the mock login accepts any email if password is `password` and returns `{ token: 'mock-token', user: { email } }`.

If you need to test the flow using cURL or other tools, here is an example request that should return a 200 with the mock response (when dev mocks are enabled):

```pwsh
curl -X POST http://localhost:3000/api/mock/login -H "Content-Type: application/json" --data '{"email":"anything@example.com","password":"password"}'
```

## Building for production

To build the project for production:

```pwsh
npm run build
npm start
```

When deploying, you probably want to disable mocks and set `NEXT_PUBLIC_API_URL` to your backend's base URL.

## Formatting, linting and type checking

- Type checking with TypeScript is available via `tsc` or integrated into the Next.js build.
- ESLint is configured; run `npm run lint` to check files.

## Commit linting and Husky (recommended)

To keep commits consistent, configure `commitlint` and Husky locally. The project does not enforce it automatically, but you can add it:

1. Install dev dependencies (example):

```pwsh
npm install -D husky @commitlint/config-conventional @commitlint/cli
```

2. Add a `commitlint.config.js` at the repo root with:

```js
module.exports = {
  extends: ["@commitlint/config-conventional"],
};
```

3. Initialize Husky and add the commit-msg hook:

```pwsh
npx husky install
npx husky add .husky/commit-msg "npx --no -- commitlint --edit $1"
```

4. Make a small package.json script to ensure husky is installed after `npm install`:

```json
"scripts": {
  "prepare": "husky install"
}
```

Now commits will be checked by commitlint. Adjust the configuration to your team's rules if needed.

## Troubleshooting

- If forms don't submit, check that `src/components/ui/button.tsx` forwards refs and that `src/components/ui/input.tsx` forwards refs to the native input element. These are necessary for `react-hook-form` to work.
- If network requests go to an external host and not to the Next.js mock routes, clear `NEXT_PUBLIC_API_URL` or set it to an empty value so the axios client uses relative URLs.
- If you see `401` from `/api/mock/login`, confirm you're sending `password: "password"` in the request when using the dev mock.
- If you edited server files and the routes don't reflect changes, restart the dev server.

## Useful commands

```pwsh
npm install        # install dependencies
npm run dev        # start dev server
npm run build      # build for production
npm start          # start built server
npm run lint       # run ESLint
```

## Next steps and suggestions

- If you want I can also create `commitlint.config.js` and the Husky commit hook automatically and commit them to the repository.
- I can also add a short `CONTRIBUTING.md` with commit message conventions and a small checklist for PRs.

---

If something in these instructions doesn't match your local environment, tell me what failed and I will update the README again.
