import { Greeting } from "@fullstack-demo/contracts";
import { getBackendOrigin } from "@/lib/get-backend-origin";
import { Stack } from "@fullstack-demo/design-system";
import PaginatedList from "./components/paginated-list";
import ServerGreetingsPreview from "./components/server-greetings-preview";

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

  return (
    <Stack gap="xl">
      <ServerGreetingsPreview greetings={greetings} />
      <PaginatedList
        title="All greetings"
        description="Browse the full list from the NestJS backend with client-side pagination."
      />
    </Stack>
  );
}
