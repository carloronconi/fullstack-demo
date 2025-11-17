"use client";

import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Label,
  Select,
  Skeleton,
  SparklesIcon,
  Stack,
} from "@fullstack-demo/design-system";
import { useEffect, useState } from "react";
import GreetingCard from "./greeting-card";
import { usePaginatedGreetings } from "../hooks/use-paginated-greetings";

type Props = {
  title: string;
  description: string;
};

const PAGE_SIZE_OPTIONS = [3, 5, 10];
const DEFAULT_PAGE_SIZE = PAGE_SIZE_OPTIONS[0];

export default function PaginatedList({ title, description }: Props) {
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const {
    greetings,
    isLoading,
    goToNextPage,
    goToPreviousPage,
    loadFirstPage,
  } = usePaginatedGreetings(pageSize);
  const pageSizeSelectId = "paginated-list-page-size";

  useEffect(() => {
    loadFirstPage();
  }, [loadFirstPage]);

  return (
    <Card>
      <CardHeader className="items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Stack gap="xs" className="flex-1">
          <CardTitle>{title}</CardTitle>
          {description ? <CardDescription>{description}</CardDescription> : null}
        </Stack>
        <Stack direction="column" gap="xs" align="start" className="sm:items-end">
          <Label htmlFor={pageSizeSelectId}>Page size</Label>
          <Select
            id={pageSizeSelectId}
            value={pageSize.toString()}
            onChange={(event) => setPageSize(Number(event.target.value))}
          >
            {PAGE_SIZE_OPTIONS.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </Select>
        </Stack>
      </CardHeader>
      <CardContent>
        <Stack gap="md">
          {greetings && greetings.length > 0 ? (
            greetings.map((greeting) => (
              <GreetingCard key={greeting.id} {...greeting} />
            ))
          ) : greetings && greetings.length === 0 ? (
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
          ) : (
            <Skeleton />
          )}
        </Stack>
      </CardContent>
      <CardFooter className="w-full">
        <Stack direction="row" justify="between" className="w-full">
          <Button
            disabled={isLoading || !goToPreviousPage}
            loading={isLoading}
            onClick={goToPreviousPage ?? undefined}
          >
            Previous
          </Button>
          <Button
            disabled={isLoading || !goToNextPage}
            loading={isLoading}
            onClick={goToNextPage ?? undefined}
          >
            Next
          </Button>
        </Stack>
      </CardFooter>
    </Card>
  );
}
