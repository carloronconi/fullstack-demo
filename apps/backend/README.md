# NestJS docs

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Project setup

```bash
$ pnpm install
```

## Compile and run the project

```bash
# development
$ pnpm run start

# watch mode
$ pnpm run start:dev

# production mode
$ pnpm run start:prod
```

## Run tests

```bash
# unit tests
$ pnpm run test

# e2e tests
$ pnpm run test:e2e

# test coverage
$ pnpm run test:cov
```

# Backend docs

## Populating the apps/backend/.env file

In prod, pull from vault. For dev, use these sample values.

```
PORT=3001
FRONTEND_ORIGIN=http://localhost:3000
MONGODB_DB=greetings
MONGODB_HOST=localhost
MONGODB_PORT=27017
MONGODB_AUTH_SOURCE=admin
MONGODB_USER=root
MONGODB_PASSWORD=root
```

## Starting the server

```bash
pnpm -w dev:backend
```

# DB docs

## Starting the DB

This starts the DB in detached mode.

```bash
cd apps/backend
 docker compose -f docker-compose.mongodb.yml up -d
```

## Running the migration

This will populate mongo with seed data.

```bash
cd apps/backend
TS_NODE_PROJECT=tsconfig.json pnpm run typeorm migration:run -d src/database/typeorm.datasource.ts
```

## Shutting the DB down

```bash
 docker compose -f docker-compose.mongodb.yml down
```
