import { Greeting } from "@fullstack-demo/contracts";
import PaginatedList from "./components/paginated-list";
import GreetingPreview from "./components/greeting-preview";

export default async function GreetingsPage() {
  const response = await fetch(`${process.env.BACKEND_ORIGIN}/greetings`);

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
    <PaginatedList title="Greetings List">
      {greetings.map((greeting) => (
        <GreetingPreview key={greeting.id} {...greeting} />
      ))}
    </PaginatedList>
  );
}
