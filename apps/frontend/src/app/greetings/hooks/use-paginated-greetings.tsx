import { getBackendOrigin } from "@/lib/get-backend-origin";
import { Greeting, CursorPaginationResult } from "@fullstack-demo/contracts";
import { useState, useCallback } from "react";

export function usePaginatedGreetings(pageSize: number) {
  const [greetings, setGreetings] = useState<Array<Greeting> | undefined>();
  const [nextAscCursorId, setNextAscCursorId] = useState<string | null>(null);
  const [nextDescCursorId, setNextDescCursorId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchGreetings = useCallback(
    async ({
      cursorId,
      sort,
    }: {
      cursorId: string | null;
      sort: "asc" | "desc";
    }) => {
      setIsLoading(true);

      try {
        const backendOrigin = getBackendOrigin();

        const searchParams = new URLSearchParams({
          limit: pageSize.toString(),
          sort,
        });
        if (cursorId) {
          searchParams.append("cursorId", cursorId);
        }

        const response = await fetch(
          `${backendOrigin}/greetings?${searchParams}`
        );

        if (!response.ok) {
          throw new Error("Failed to load greetings");
        }

        const paginationResult: CursorPaginationResult<Greeting> =
          await response.json();

        const normalizedItems =
          sort === "desc"
            ? [...paginationResult.items].reverse()
            : paginationResult.items;

        setNextAscCursorId(paginationResult.nextAscCursorId);
        setNextDescCursorId(paginationResult.nextDescCursorId);
        setGreetings(normalizedItems);
      } finally {
        setIsLoading(false);
      }
    },
    [pageSize]
  );

  const canGoNext = nextAscCursorId !== null;
  const canGoPrevious = nextDescCursorId !== null;

  const goToNextPage = useCallback(() => {
    if (!canGoNext || isLoading) return;

    const targetCursor = greetings === undefined ? null : nextAscCursorId;
    fetchGreetings({ cursorId: targetCursor ?? null, sort: "asc" });
  }, [canGoNext, fetchGreetings, greetings, isLoading, nextAscCursorId]);

  const goToPreviousPage = useCallback(() => {
    if (!canGoPrevious || isLoading) return;

    fetchGreetings({ cursorId: nextDescCursorId, sort: "desc" });
  }, [canGoPrevious, fetchGreetings, isLoading, nextDescCursorId]);

  const loadFirstPage = useCallback(() => {
    fetchGreetings({ cursorId: null, sort: "asc" });
  }, [fetchGreetings]);

  return {
    greetings,
    isLoading,
    goToNextPage: canGoNext ? goToNextPage : null,
    goToPreviousPage: canGoPrevious ? goToPreviousPage : null,
    loadFirstPage,
  };
}
