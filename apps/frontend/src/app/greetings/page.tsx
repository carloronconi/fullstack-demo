import { Greeting } from "@fullstack-demo/contracts";
import { SparklesIcon, Stack } from "@fullstack-demo/design-system";
import GreetingPreview from "./components/greeting-preview";
import PaginatedList from "./components/paginated-list";
import { getBackendOrigin } from "@/lib/get-backend-origin";

export default async function GreetingsPage() {
  const backendOrigin = getBackendOrigin();

  const response = await fetch(`${backendOrigin}/greetings`);

  if (!response.ok) {
    throw new Error("Failed to load greetings");
  }

  const greetings: Greeting[] = await response.json().then((data) => {
    return data.map((greeting: Greeting) => ({
      ...greeting,
      createdAt: new Date(greeting.createdAt),
    }));
  });

  const hasGreetings = greetings.length > 0;

  return (
    <PaginatedList
      title="All greetings"
      description="Synced directly from the NestJS backend."
    >
      {hasGreetings ? (
        greetings.map((greeting) => (
          <GreetingPreview key={greeting.id} {...greeting} />
        ))
      ) : (
        <Stack
          gap="sm"
          align="center"
          className="w-full rounded-md border border-dashed border-border/60 bg-surface-soft px-6 py-10 text-center"
        >
          <SparklesIcon className="h-6 w-6 text-primary" />
          <p className="text-sm text-muted">
            No greetings yet. Use the dashboard to create the first message.
          </p>
        </Stack>
      )}
    </PaginatedList>
  );
}
