"use client";

import { useEffect } from "react";
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@fullstack-demo/design-system";

type RootErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function RootError({ error, reset }: RootErrorProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-surface-strong px-4 py-10">
      <Card>
        <CardContent>
          <CardTitle>Something went wrong</CardTitle>
          <CardDescription>
            {error.message || "We hit an unexpected error. Please try again."}
          </CardDescription>
          {error.digest ? (
            <p className="text-xs font-mono text-muted">
              Error ID: {error.digest}
            </p>
          ) : null}
          <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button onClick={reset} className="w-full sm:w-auto">
              Try again
            </Button>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
