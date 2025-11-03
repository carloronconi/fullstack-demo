import { Badge, Card, CardContent, Stack } from "@fullstack-demo/design-system";

type Props = {
  content: string;
  id: string;
  countryCode: string;
  createdAt: Date;
};

export default function GreetingPreview({
  content,
  id,
  countryCode,
  createdAt,
}: Props) {
  const createdLabel = new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(createdAt);

  return (
    <Card
      className="border border-border/60 shadow-(--shadow-subtle) transition hover:border-primary/40"
      data-testid={`greeting-${id}`}
    >
      <CardContent className="gap-4">
        <Stack direction="row" justify="between" align="start">
          <Stack gap="xs">
            <h3 className="text-base font-semibold tracking-tight text-foreground">
              {content}
            </h3>
            <p className="text-xs font-mono text-muted">ID: {id}</p>
          </Stack>
          <Badge tone="brand" variant="soft">
            {countryCode}
          </Badge>
        </Stack>
        <p className="text-sm text-muted">Created {createdLabel}</p>
      </CardContent>
    </Card>
  );
}
