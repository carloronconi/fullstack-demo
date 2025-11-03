import { GreetingsDashboard } from "./greetings-dashboard";
import {
  Badge,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Stack,
} from "@fullstack-demo/design-system";

export default function Home() {
  return (
    <main>
      <Stack
        gap="xl"
        className="mx-auto min-h-screen w-full max-w-6xl px-6 py-12 sm:px-10 lg:px-16"
      >
        <header className="flex flex-col gap-3">
          <Badge tone="brand" variant="soft" className="self-start">
            Fullstack demo
          </Badge>
          <Stack gap="xs">
            <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
              Manage greetings with confidence
            </h1>
            <p className="text-base text-muted">
              Create, inspect and clean up greetings exposed by the shared
              NestJS backend. Everything below uses the workspace design system.
            </p>
          </Stack>
        </header>

        <GreetingsDashboard />

        <Card className="border-dashed border-border/60 bg-surface-soft shadow-(--shadow-subtle)">
          <CardHeader>
            <CardTitle>Developer quickstart</CardTitle>
            <CardDescription>
              Keep the services aligned when running the demo locally.
            </CardDescription>
          </CardHeader>
          <CardContent className="gap-3">
            <p className="text-sm text-muted">
              Run <code>pnpm dev:all</code> to start both frontend and backend.
            </p>
            <p className="text-sm text-muted">
              The dashboard expects the API at{" "}
              <code>http://localhost:3001</code>. Update{" "}
              <code>BACKEND_ORIGIN</code> and <code>NEXT_PUBLIC_API_KEY</code>{" "}
              to point at your backend when it lives elsewhere.
            </p>
          </CardContent>
        </Card>
      </Stack>
    </main>
  );
}
