This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Frontend + Backend demo

The landing page demonstrates how the Next.js app talks to the NestJS backend:

- When the page loads, the `BackendMessage` component requests `GET /api/hello` from the backend.
- The response payload is rendered directly in the UI so you can confirm the integration works.

## Development workflow

From the repository root, start both apps together:

```bash
pnpm dev:all
```

The frontend runs on [http://localhost:3000](http://localhost:3000) and expects the backend on [http://localhost:3001](http://localhost:3001) by default.
