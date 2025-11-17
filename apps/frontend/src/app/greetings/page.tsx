import { Stack } from "@fullstack-demo/design-system";
import PaginatedList from "./components/paginated-list";
import ServerGreetingsPreview from "./components/server-greetings-preview";

export default async function GreetingsPage() {
  return (
    <Stack gap="xl">
      <ServerGreetingsPreview />
      <PaginatedList
        title="All greetings"
        description="Browse the full list from the NestJS backend with client-side pagination."
      />
    </Stack>
  );
}
