import {
  Card,
  CardContent,
  CardHeader,
  Skeleton,
  Stack,
} from "@fullstack-demo/design-system";

export default function Loading() {
  return (
    <Card>
      <CardHeader className="flex-col items-start gap-2">
        <Skeleton className="h-6 w-40" />
        <Skeleton className="h-4 w-64" />
      </CardHeader>
      <CardContent>
        <Stack gap="md">
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
        </Stack>
      </CardContent>
    </Card>
  );
}
