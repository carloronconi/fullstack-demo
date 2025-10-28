# Blank Slate Full-Stack Setup (Next.js + NestJS + pnpm)

## 🧰 System setup

1. Installed Xcode Command Line Tools

```bash
xcode-select --install
```

2. Installed Homebrew for package management.
3. Installed fnm (Fast Node Manager) and pnpm via Homebrew:

```bash
brew install fnm pnpm
```

4. Installed Node LTS using fnm and set it as default:

```bash
fnm install --lts
fnm default $(fnm current)
```

→ Default Node version: 20.x

## 🧩 Monorepo setup

1. Created root folder:

```bash
mkdir fullstack-demo && cd fullstack-demo
pnpm init
```

2. Created workspace definition:

pnpm-workspace.yaml

```yaml
packages:
- "apps/\*"
```

3.  Created apps:

```bash
pnpm create next-app apps/frontend --typescript --use-pnpm --no-git
pnpm dlx @nestjs/cli new apps/backend --package-manager pnpm --skip-git
```

4. Deleted any extra lockfiles in subfolders to keep a single root lockfile:

```bash
rm apps/\*/pnpm-lock.yaml
pnpm install
```

5. Installed nest CLI as dev dependency

The CLI is the best tool to continue building the scaffolding for other modules, consistently with the framework.

```bash
pnpm add -g @nestjs/cli
```

## ⚙️ Dev scripts

Added to root package.json:

```json
"scripts": {
"dev:frontend": "pnpm --filter frontend dev",
"dev:backend": "pnpm --filter backend start:dev",
"dev:all": "concurrently \"pnpm dev:frontend\" \"pnpm dev:backend\""
},
"devDependencies": {
"concurrently": "^8.2.0"
}
```

Then:

```bash
pnpm add -D concurrently
```

## 🌍 Environment variables

NestJS

1. Installed config module only for backend:

```bash
pnpm add @nestjs/config --filter backend
```

2. Enabled it in AppModule:

```ts
ConfigModule.forRoot({ isGlobal: true });
```

3. Added .env in apps/backend:

```
PORT=3001
```

4. Updated main.ts:

```ts
await app.listen(process.env.PORT ?? 3001);
```

Next.js
• .env.local automatically loaded by Next.js
• Example in apps/frontend/.env.local:

```
NEXT_PUBLIC_API_URL=http://localhost:3001
```

## 🧠 Final run

```bash
pnpm dev:all
```

→ Next.js: http://localhost:3000
→ NestJS: http://localhost:3001
