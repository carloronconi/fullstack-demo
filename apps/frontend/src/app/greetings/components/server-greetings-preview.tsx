import { Greeting } from "@fullstack-demo/contracts";
import { Badge, SparklesIcon, Stack } from "@fullstack-demo/design-system";
import GreetingCard from "./greeting-card";

type Props = {
  greetings: Greeting[];
};

export default function ServerGreetingsPreview({ greetings }: Props) {
  const featuredGreetings = greetings.slice(0, 2);
  const hasFeaturedGreetings = featuredGreetings.length > 0;

  return (
    <section>
      <Stack gap="md">
        <Stack direction="row" align="center" gap="sm">
          <Badge
            tone="brand"
            variant="solid"
            className="rounded-full px-3 py-1 text-xs uppercase tracking-wide"
          >
            Server rendered
          </Badge>
          <h2 className="flex items-center gap-2 text-lg font-semibold text-foreground">
            <SparklesIcon className="h-5 w-5 text-primary" aria-hidden />
            Latest greetings
          </h2>
        </Stack>
        {hasFeaturedGreetings ? (
          <Stack gap="md">
            {featuredGreetings.map((greeting) => (
              <GreetingCard key={greeting.id} {...greeting} />
            ))}
          </Stack>
        ) : (
          <p className="text-sm text-muted">
            No greetings are available yet. Check back soon!
          </p>
        )}
      </Stack>
    </section>
  );
}
