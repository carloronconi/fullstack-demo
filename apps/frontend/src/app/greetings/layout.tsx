import { Badge, Stack } from "@fullstack-demo/design-system";

export default function GreetingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-surface px-6 py-12 sm:px-10 lg:px-16">
      <Stack gap="xl" className="mx-auto w-full max-w-5xl">
        <Stack gap="xs">
          <Badge tone="brand" variant="soft" className="self-start">
            Greetings
          </Badge>
          <h1 className="text-4xl font-semibold tracking-tight">
            Browse shared messages
          </h1>
          <p className="text-base text-muted">
            Review all greetings served by the NestJS backend. Use the dashboard
            on the homepage to create or update entries.
          </p>
        </Stack>
        {children}
      </Stack>
    </div>
  );
}
