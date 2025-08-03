# Repository Summary

## Purpose

**Feather Memoir** is a TypeScript **AdonisJS v6** application for archiving and processing user tweets. It supports normal tweets, retweets, and quoted tweets, storing data in a SQLite database via Lucid ORM.

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
- `commands/`: CLI commands for fetching and loading tweets, managing target users
- Root files: `package.json`, `tsconfig.json`, `adonisrc.ts`, `eslint.config.js`, `.env.example`, etc.

## CI & Workflows

Triggered on push to the `default` branch and pull requests. The workflow sets up Node, installs dependencies, then runs type checks, lint, Prettier, and tests, failing on formatting or lint errors.

## Branch rules

- The "master/main" branch is named `default`. Notice that this naming convention doesn't follow today's widely-accepted git/github workflow standard. Your work mostly will start from this branch unless otherwise stated, so be sure to pull all the remote changes before starting to work!
- The branch of your (i.e. OpenHands's) sessions should be named `openhands/<describe your work>`.

## Commit rules

- Commit immediately whenever you make a small change. As a general rule, associate only one action (verb) with each commit.
- A pre-commit hook will detect any linting, formatting, or type-check violations. The larger your changes become, the harder it is to fix those violations. From this perspective as well, please commit as early as possible whenever you make any changes.

<IMPORTANT_RULE>

You must always read the documentations of the AdonisJS v6 or any other tech stacks BEFORE you start anything. You must use Context7 system tools (`resolve-library-id` and `get-library-docs`) to read any docs first.

</IMPORTANT_RULE>
