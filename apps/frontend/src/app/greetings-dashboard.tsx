"use client";

import {
  COUNTRY_CODES,
  CursorPaginationResult,
  type CountryCode,
  type CreateGreetingPayload,
  type Greeting,
} from "@fullstack-demo/contracts/greetings";
import { FormEvent, useCallback, useEffect, useState } from "react";
import {
  AlertTriangleIcon,
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  CheckIcon,
  Divider,
  Field,
  HelperText,
  Input,
  Select,
  Skeleton,
  SparklesIcon,
  Stack,
  SearchIcon,
  cn,
} from "@fullstack-demo/design-system";
import { getBackendOrigin } from "@/lib/get-backend-origin";

type SortOrder = "asc" | "desc";

const API_KEY = process.env.NEXT_PUBLIC_API_KEY ?? "my-secret-key";
const BACKEND_ORIGIN = getBackendOrigin();

const dateTimeFormatter = new Intl.DateTimeFormat("en", {
  dateStyle: "medium",
  timeStyle: "short",
});

const formatTimestamp = (value: string | Date) =>
  dateTimeFormatter.format(typeof value === "string" ? new Date(value) : value);

export function GreetingsDashboard() {
  const [greetings, setGreetings] = useState<Greeting[]>([]);
  const [listStatus, setListStatus] = useState<"loading" | "ready" | "error">(
    "loading"
  );
  const [listError, setListError] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
  const [isRefreshing, setIsRefreshing] = useState(false);

  const [flashMessage, setFlashMessage] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const [content, setContent] = useState("");
  const [countryCode, setCountryCode] = useState<CountryCode>(COUNTRY_CODES[0]);
  const [createError, setCreateError] = useState<string | null>(null);
  const [createStatus, setCreateStatus] = useState<"idle" | "submitting">(
    "idle"
  );

  const [lookupId, setLookupId] = useState("");
  const [lookupStatus, setLookupStatus] = useState<
    "idle" | "loading" | "error"
  >("idle");
  const [lookupError, setLookupError] = useState<string | null>(null);
  const [lookupResult, setLookupResult] = useState<Greeting | null>(null);

  const [deletingId, setDeletingId] = useState<string | null>(null);

  const greetingsEndpoint = `${BACKEND_ORIGIN}/greetings`;

  const fetchGreetings = useCallback(
    async (order: SortOrder) => {
      const res = await fetch(`${greetingsEndpoint}?sort=${order}`);
      if (!res.ok) {
        throw new Error(`Failed to load greetings (status ${res.status})`);
      }

      return res.json().then((data: CursorPaginationResult<Greeting>) => {
        return data.items;
      });
    },
    [greetingsEndpoint]
  );

  const refreshGreetings = useCallback(
    async (order: SortOrder, opts?: { silent?: boolean }) => {
      const silent = opts?.silent ?? false;
      if (silent) {
        setIsRefreshing(true);
      } else {
        setListStatus("loading");
        setListError(null);
      }
      try {
        const data = await fetchGreetings(order);
        setGreetings(data);
        setListStatus("ready");
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Unknown error";
        setListError(message);
        setListStatus("error");
      } finally {
        if (silent) {
          setIsRefreshing(false);
        }
      }
    },
    [fetchGreetings]
  );

  useEffect(() => {
    void refreshGreetings(sortOrder);
  }, [refreshGreetings, sortOrder]);

  const handleLookupById = useCallback(
    async (id: string) => {
      if (!id) {
        setLookupError("Provide a greeting id");
        setLookupStatus("error");
        setLookupResult(null);
        return;
      }
      setLookupStatus("loading");
      setLookupError(null);
      setFlashMessage(null);
      try {
        const res = await fetch(`${greetingsEndpoint}/${id}`);
        if (res.status === 404) {
          setLookupResult(null);
          setLookupStatus("error");
          setLookupError("Greeting not found");
          return;
        }
        if (!res.ok) {
          throw new Error(`Lookup failed (status ${res.status})`);
        }
        const payload = (await res.json()) as Greeting;
        setLookupResult(payload);
        setLookupStatus("idle");
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Unknown lookup error";
        setLookupError(message);
        setLookupStatus("error");
        setLookupResult(null);
      }
    },
    [greetingsEndpoint]
  );

  const handleCreate = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      if (!content.trim()) {
        setCreateError("Content is required");
        return;
      }
      setCreateError(null);
      setFlashMessage(null);
      setCreateStatus("submitting");
      try {
        const payload: CreateGreetingPayload = {
          content: content.trim(),
          countryCode,
        };
        const res = await fetch(greetingsEndpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-API-KEY": API_KEY,
          },
          body: JSON.stringify(payload),
        });

        if (res.status === 403) {
          throw new Error("Invalid API key. Check NEXT_PUBLIC_API_KEY.");
        }
        if (!res.ok) {
          throw new Error(`Failed to create greeting (status ${res.status})`);
        }

        const insertedId = (await res.text()).replace(/"/g, "").trim();
        setContent("");
        setCountryCode(COUNTRY_CODES[0]);
        setFlashMessage({
          type: "success",
          message: `Created greeting ${insertedId}`,
        });
        await refreshGreetings(sortOrder, { silent: true });
        if (lookupResult?.id) {
          const shouldRefreshLookup = lookupResult.id === insertedId;
          if (shouldRefreshLookup) {
            await handleLookupById(insertedId);
          }
        }
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Failed to create greeting";
        setCreateError(message);
        setFlashMessage({ type: "error", message });
      } finally {
        setCreateStatus("idle");
      }
    },
    [
      content,
      countryCode,
      greetingsEndpoint,
      handleLookupById,
      lookupResult,
      refreshGreetings,
      sortOrder,
    ]
  );

  const handleLookupSubmit = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      await handleLookupById(lookupId.trim());
    },
    [handleLookupById, lookupId]
  );

  const handleDelete = useCallback(
    async (id: string) => {
      setDeletingId(id);
      setFlashMessage(null);
      try {
        const res = await fetch(`${greetingsEndpoint}/${id}`, {
          method: "DELETE",
          headers: {
            "X-API-KEY": API_KEY,
          },
        });
        if (res.status === 404) {
          throw new Error("Greeting not found. It may have been removed.");
        }
        if (res.status === 403) {
          throw new Error("Invalid API key. Check NEXT_PUBLIC_API_KEY.");
        }
        if (!res.ok) {
          throw new Error(`Failed to delete greeting (status ${res.status})`);
        }
        setFlashMessage({
          type: "success",
          message: `Deleted greeting ${id}`,
        });
        await refreshGreetings(sortOrder, { silent: true });
        if (lookupResult?.id === id) {
          setLookupResult(null);
        }
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Failed to delete greeting";
        setFlashMessage({ type: "error", message });
      } finally {
        setDeletingId(null);
      }
    },
    [greetingsEndpoint, lookupResult, refreshGreetings, sortOrder]
  );

  const hasGreetings = greetings.length > 0;

  return (
    <Card className="shadow-(--shadow-card)">
      <CardHeader>
        <Stack gap="sm">
          <Badge
            tone="brand"
            variant="soft"
            className="w-fit items-center gap-2"
          >
            <SparklesIcon className="h-4 w-4" />
            Live playground
          </Badge>
          <Stack gap="xs">
            <CardTitle>Greetings playground</CardTitle>
            <CardDescription>
              Interact with the NestJS greetings API: list, create, find and
              delete greetings. Mutations require{" "}
              <code className="rounded-sm bg-surface-strong px-1 py-0.5 text-xs font-mono text-foreground">
                X-API-KEY
              </code>
              .
            </CardDescription>
          </Stack>
        </Stack>
      </CardHeader>
      <CardContent className="gap-8">
        {flashMessage ? (
          <div
            className={cn(
              "flex items-center gap-2 rounded-(--radius-sm) border px-4 py-3 text-sm font-medium",
              flashMessage.type === "success"
                ? "border-success/40 bg-success/10 text-success"
                : "border-danger/40 bg-danger/10 text-danger"
            )}
          >
            {flashMessage.type === "success" ? (
              <CheckIcon className="h-4 w-4" />
            ) : (
              <AlertTriangleIcon className="h-4 w-4" />
            )}
            <span>{flashMessage.message}</span>
          </div>
        ) : null}

        <Stack gap="lg">
          <section>
            <Stack gap="md">
              <Stack gap="xs">
                <h3 className="text-lg font-semibold text-foreground">
                  Create greeting
                </h3>
                <p className="text-sm text-muted">
                  Publish a new message to the shared API.
                </p>
              </Stack>
              <form onSubmit={handleCreate} noValidate>
                <Stack gap="md">
                  <Field
                    label="Message"
                    labelFor="create-message"
                    required
                    error={createError ?? undefined}
                  >
                    <Input
                      id="create-message"
                      placeholder="Say hello!"
                      value={content}
                      onChange={(event) => {
                        setContent(event.target.value);
                        if (createError) {
                          setCreateError(null);
                        }
                      }}
                      invalid={Boolean(createError)}
                      disabled={createStatus === "submitting"}
                    />
                  </Field>
                  <Field
                    label="Country"
                    labelFor="create-country"
                    hint="Used to annotate the greeting."
                  >
                    <Select
                      id="create-country"
                      value={countryCode}
                      onChange={(event) =>
                        setCountryCode(event.target.value as CountryCode)
                      }
                      disabled={createStatus === "submitting"}
                    >
                      {COUNTRY_CODES.map((code) => (
                        <option key={code} value={code}>
                          {code}
                        </option>
                      ))}
                    </Select>
                  </Field>
                  <Stack direction="row" gap="sm">
                    <Button
                      type="submit"
                      variant="primary"
                      disabled={createStatus === "submitting"}
                    >
                      {createStatus === "submitting"
                        ? "Saving…"
                        : "Create greeting"}
                    </Button>
                  </Stack>
                </Stack>
              </form>
            </Stack>
          </section>

          <Divider />

          <section>
            <Stack gap="md">
              <Stack gap="xs">
                <h3 className="text-lg font-semibold text-foreground">
                  Lookup by id
                </h3>
                <p className="text-sm text-muted">
                  Retrieve an existing greeting by its identifier.
                </p>
              </Stack>
              <form
                onSubmit={handleLookupSubmit}
                className="flex flex-col gap-3 sm:flex-row sm:items-end"
              >
                <Field
                  label="Greeting id"
                  labelFor="lookup-id"
                  className="w-full sm:flex-1"
                  error={
                    lookupStatus === "error" && lookupError
                      ? lookupError
                      : undefined
                  }
                >
                  <Input
                    id="lookup-id"
                    placeholder="Enter greeting id"
                    value={lookupId}
                    onChange={(event) => {
                      setLookupId(event.target.value);
                      if (lookupError) {
                        setLookupError(null);
                        setLookupStatus("idle");
                      }
                    }}
                    disabled={lookupStatus === "loading"}
                    invalid={lookupStatus === "error" && Boolean(lookupError)}
                  />
                </Field>
                <Button
                  type="submit"
                  variant="outline"
                  className="w-full sm:w-auto"
                  disabled={lookupStatus === "loading"}
                  leadingIcon={<SearchIcon className="h-4 w-4" />}
                >
                  {lookupStatus === "loading" ? "Searching…" : "Find greeting"}
                </Button>
              </form>
              {lookupResult ? (
                <Card className="border border-border/60 bg-surface-soft shadow-(--shadow-subtle)">
                  <CardContent className="gap-3">
                    <Stack gap="xs">
                      <p className="text-base font-medium text-foreground">
                        {lookupResult.content}
                      </p>
                      <p className="text-xs font-mono text-muted">
                        ID: {lookupResult.id}
                      </p>
                    </Stack>
                    <Stack direction="row" gap="sm" align="center">
                      <Badge tone="brand" variant="soft">
                        {lookupResult.countryCode}
                      </Badge>
                      <span className="text-sm text-muted">
                        Created {formatTimestamp(lookupResult.createdAt)}
                      </span>
                    </Stack>
                  </CardContent>
                </Card>
              ) : null}
            </Stack>
          </section>

          <Divider />

          <section>
            <Stack gap="md">
              <Stack
                direction="row-wrap"
                justify="between"
                align="center"
                gap="sm"
              >
                <Stack gap="xs">
                  <h3 className="text-lg font-semibold text-foreground">
                    All greetings
                  </h3>
                  <p className="text-sm text-muted">
                    Sorted by creation time. Use the tools above to add or
                    remove records.
                  </p>
                </Stack>
                <Stack
                  direction="row"
                  gap="sm"
                  align="center"
                  className="w-full sm:w-auto"
                >
                  <Field
                    label="Sort order"
                    labelFor="sort-order"
                    className="w-full sm:w-44"
                  >
                    <Select
                      id="sort-order"
                      value={sortOrder}
                      onChange={(event) =>
                        setSortOrder(event.target.value as SortOrder)
                      }
                      disabled={listStatus === "loading"}
                    >
                      <option value="desc">Newest first</option>
                      <option value="asc">Oldest first</option>
                    </Select>
                  </Field>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() =>
                      refreshGreetings(sortOrder, { silent: true })
                    }
                    disabled={isRefreshing}
                  >
                    {isRefreshing ? "Refreshing…" : "Refresh"}
                  </Button>
                </Stack>
              </Stack>

              {listStatus === "loading" ? (
                <Stack gap="sm">
                  {Array.from({ length: 3 }).map((_, index) => (
                    <Skeleton key={index} className="h-24 w-full rounded-md" />
                  ))}
                </Stack>
              ) : null}

              {listStatus === "error" && listError ? (
                <HelperText tone="danger">{listError}</HelperText>
              ) : null}

              {listStatus === "ready" && !hasGreetings ? (
                <Stack
                  gap="sm"
                  align="center"
                  className="rounded-md border border-dashed border-border/60 bg-surface-soft px-6 py-10 text-center"
                >
                  <SparklesIcon className="h-6 w-6 text-primary" />
                  <p className="text-sm text-muted">
                    No greetings yet. Create one above to populate the list.
                  </p>
                </Stack>
              ) : null}

              {listStatus === "ready" && hasGreetings ? (
                <Stack gap="sm">
                  {greetings.map((greeting) => (
                    <Card
                      key={greeting.id}
                      className="border border-border/60 shadow-(--shadow-subtle)"
                    >
                      <CardContent className="gap-4">
                        <Stack direction="row" justify="between" align="start">
                          <Stack gap="xs">
                            <p className="text-base font-medium text-foreground">
                              {greeting.content}
                            </p>
                            <p className="text-xs font-mono text-muted">
                              ID: {greeting.id}
                            </p>
                          </Stack>
                          <Button
                            type="button"
                            variant="danger"
                            size="sm"
                            onClick={() => handleDelete(greeting.id)}
                            disabled={deletingId === greeting.id}
                          >
                            {deletingId === greeting.id
                              ? "Deleting…"
                              : "Delete"}
                          </Button>
                        </Stack>
                        <Stack direction="row" gap="sm" align="center">
                          <Badge tone="brand" variant="soft">
                            {greeting.countryCode}
                          </Badge>
                          <span className="text-sm text-muted">
                            Created {formatTimestamp(greeting.createdAt)}
                          </span>
                        </Stack>
                      </CardContent>
                    </Card>
                  ))}
                </Stack>
              ) : null}
            </Stack>
          </section>
        </Stack>
      </CardContent>
      <CardFooter>
        <p className="text-sm text-muted">
          Update <code>BACKEND_ORIGIN</code> and{" "}
          <code>NEXT_PUBLIC_API_KEY</code> in <code>.env</code> if your backend
          lives elsewhere or uses a different key.
        </p>
      </CardFooter>
    </Card>
  );
}
