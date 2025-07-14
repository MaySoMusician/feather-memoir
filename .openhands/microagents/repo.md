# Repository Summary

## Purpose

**Feather Memoir** is a TypeScript AdonisJS application for archiving and processing user tweets. It supports normal tweets, retweets, and quoted tweets, storing data in a SQLite database via Lucid ORM.

## Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Configure environment:

   ```bash
   cp .env.example .env
   ```

   and update variables as needed.

3. Run database migrations and seeders:

   ```bash
   node ace migration:run
   node ace db:seed
   ```

4. Development and other scripts:

   - `npm run dev`: start development server with HMR
   - `npm start`: build and start the server
   - `npm run test`: run Japa tests
   - `npm run lint`: run ESLint
   - `npm run format`: run Prettier
   - `npm run typecheck`: run TypeScript type checking

## Structure

- `bin/`: CLI entrypoints (`server.ts`, `console.ts`, `test.ts`)
- `app/`: controllers, models, middleware, exceptions
- `config/`: AdonisJS and database configuration files
- `database/`: migrations and seeders
- `start/`: application bootstrap (`routes.ts`, `kernel.ts`)
- `tests/`: Japa tests and bootstrap
- Root files: `package.json`, `tsconfig.json`, `adonisrc.ts`, `eslint.config.js`, `.env.example`, etc.

## CI & Workflows

The repository uses GitHub Actions for continuous integration, defined in `.github/workflows/ci.yml`:

- Triggers:
  - `push` to the `default` branch
  - `pull_request` events
- Jobs:
  1. Checkout code (`actions/checkout@v3`)
  2. Setup Node.js 22.x with npm cache (`actions/setup-node@v3`)
  3. Install dependencies (`npm ci`)
  4. Run TypeScript type-check (`npm run typecheck`)
  5. Run ESLint (`npm run lint`)
  6. Check Prettier formatting (`npx prettier --check .`)
  7. Run tests (`npm run test`)

Any lint or formatting violations will cause the CI to fail.

## Branch rules

- The "master/main" branch is named `default`. Notice that this naming convention doesn't follow today's widely-accepted git/github workflow standard. Your work mostly will start from this branch unless otherwise stated, so be sure to pull all the remote changes before starting to work!
- The branch of your (i.e. OpenHands's) sessions should be named `openhands/<describe your work>`.

## Commit rules

- Commit immediately whenever you make a small change. As a general rule, associate only one action (verb) with each commit.
- A pre-commit hook will detect any linting, formatting, or type-check violations. The larger your changes become, the harder it is to fix those violations. From this perspective as well, please commit as early as possible whenever you make any changes.
