import { Greeting } from "@fullstack-demo/contracts";
import { notFound } from "next/navigation";
import { getBackendOrigin } from "@/lib/get-backend-origin";

import {
  Badge,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  Stack,
  StatBox,
} from "@fullstack-demo/design-system";

export default async function GreetingDetailsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const backendOrigin = getBackendOrigin();

  const response = await fetch(`${backendOrigin}/greetings/${slug}`, {
    cache: "no-store",
  });

  if (response.status === 404) {
    notFound();
  }

  if (!response.ok) {
    throw new Error("Failed to load greeting");
  }

  const greeting = (await response.json()) as Greeting;

  const createdLabel = new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(greeting.createdAt));

  return (
    <Card>
      <CardHeader>
        <Stack direction="row" align="center" justify="between">
          <Stack gap="xs">
            <CardTitle>Greeting overview</CardTitle>
            <CardDescription>
              Details for entry <span className="font-mono">{slug}</span>.
            </CardDescription>
          </Stack>
          <Badge tone="brand" variant="soft">
            {greeting.countryCode}
          </Badge>
        </Stack>
      </CardHeader>
      <CardContent className="gap-6">
        <p className="text-lg font-medium leading-relaxed text-foreground">
          {greeting.content}
        </p>
        <Stack direction="row-wrap" gap="md">
          <StatBox label="Country" value={greeting.countryCode} />
          <StatBox label="Created" value={createdLabel} />
        </Stack>
        <p className="text-xs font-mono text-muted">
          Identifier: {greeting.id}
        </p>
      </CardContent>
    </Card>
  );
}
