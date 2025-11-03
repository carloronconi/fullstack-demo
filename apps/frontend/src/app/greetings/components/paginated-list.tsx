"use client";

import { getBackendOrigin } from "@/lib/get-backend-origin";
import { Greeting } from "@fullstack-demo/contracts";
import {
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

type Props = {
  title: string;
  description: string;
};

function usePaginatedGreetings() {
  const [greetings, setGreetings] = useState<Array<Greeting> | undefined>();

  async function fetchGreetings(pageNumber: number, pageSize: number) {
    const backendOrigin = getBackendOrigin();

    const response = await fetch(`${backendOrigin}/greetings`);

    if (!response.ok) {
      throw new Error("Failed to load greetings");
    }

    const greetings: Greeting[] = await response.json().then((data) => {
      return (
        data
          .map((greeting: Greeting) => ({
            ...greeting,
            createdAt: new Date(greeting.createdAt),
          }))
          // simulates pagination
          // it should be done on the backend by passing pageNumber and pageSize as query params
          .slice((pageNumber - 1) * pageSize, pageNumber * pageSize)
      );
    });
    setGreetings(greetings);
  }

  function refreshGreetings(newPageNumber: number, newPageSize: number) {
    setGreetings(undefined);
    fetchGreetings(newPageNumber, newPageSize);
  }

  return {
    greetings,
    refreshGreetings,
  };
}

const PAGE_SIZE_OPTIONS = [3, 5, 10];
const PAGE_NUMBER_OPTIONS = [1, 2, 3];
const DEFAULT_PAGE_SIZE = PAGE_SIZE_OPTIONS[0];
const DEFAULT_PAGE_NUMBER = PAGE_NUMBER_OPTIONS[0];

export default function PaginatedList({ title, description }: Props) {
  const { greetings, refreshGreetings } = usePaginatedGreetings();
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const [pageNumber, setPageNumber] = useState(DEFAULT_PAGE_NUMBER);
  const pageSizeSelectId = "paginated-list-page-size";
  const pageNumberSelectId = "paginated-list-page-number";

  useEffect(() => {
    refreshGreetings(pageNumber, pageSize);
  }, [refreshGreetings, pageNumber, pageSize]);

  return (
    <Card>
      <CardHeader className="items-start gap-2 sm:flex-col sm:items-start">
        <CardTitle>{title}</CardTitle>
        {description ? <CardDescription>{description}</CardDescription> : null}
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
        <Stack direction="row" justify="end" className="w-full">
          <Stack direction="column" gap="xs" align="start">
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
          <Stack direction="column" gap="xs" align="start">
            <Label htmlFor={pageNumberSelectId}>Page number</Label>
            <Select
              id={pageNumberSelectId}
              value={pageNumber.toString()}
              onChange={(event) => setPageNumber(Number(event.target.value))}
            >
              {PAGE_NUMBER_OPTIONS.map((number) => (
                <option key={number} value={number}>
                  {number}
                </option>
              ))}
            </Select>
          </Stack>
        </Stack>
      </CardFooter>
    </Card>
  );
}
