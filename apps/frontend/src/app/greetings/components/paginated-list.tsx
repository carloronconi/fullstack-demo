import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Stack,
} from "@fullstack-demo/design-system";

type Props = {
  children: React.ReactNode;
  title: string;
  description?: string;
};

export default function PaginatedList({
  children,
  title,
  description,
}: Props) {
  return (
    <Card>
      <CardHeader className="items-start gap-2 sm:flex-col sm:items-start">
        <CardTitle>{title}</CardTitle>
        {description ? (
          <CardDescription>{description}</CardDescription>
        ) : null}
      </CardHeader>
      <CardContent>
        <Stack gap="md">{children}</Stack>
      </CardContent>
    </Card>
  );
}
