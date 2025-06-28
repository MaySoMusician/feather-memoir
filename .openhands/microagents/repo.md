# Repository Summary

## Purpose
**Feather Memoir** is a TypeScript AdonisJS application for archiving and processing user tweets. It supports normal tweets, retweets, and quoted tweets, storing data in a SQLite database via Lucid ORM.

## Setup
- Install dependencies: `npm install`
- Configure environment: copy `.env.example` to `.env` and adjust variables
- Database: run migrations and seeders via `node ace migration:run` and `node ace db:seed`
- Scripts:
  - `npm run dev`: start development server with HMR
  - `npm start`: build and start the server
  - `npm run test`: run Japa tests
  - `npm run lint`: run ESLint
  - `npm run format`: run Prettier
  - `npm run typecheck`: run TypeScript type checking

## Structure
- `bin/`: entrypoints for server (`server.ts`), console (`console.ts`), and test runner (`test.ts`)
- `app/`: controllers, models, middleware, exceptions
- `config/`: AdonisJS and database configuration
- `database/`: migrations and seeders
- `start/`: routes (`routes.ts`) and HTTP kernel (`kernel.ts`)
- `tests/`: Japa test bootstrap (`bootstrap.ts`)
- Other files: `package.json`, `tsconfig.json`, `eslint.config.js`, `adonisrc.ts`, `.env.example`

## CI & Workflows
No GitHub workflows detected in `.github/workflows`. CI-related tasks (lint, format, typecheck, tests) are defined as npm scripts in `package.json`.

## Branch rules
- The "master/main" branch is named `default`. Your work mostly will start from this branch unless otherwise stated, so be sure to pull all the remote changes before starting to work! Notice that this naming convention doesn't follow the today's widely-accepted git/github workflow standard.
- The branch of your (i.e. OpenHands's) sessions should be named `openhands/<describe your work>`.
