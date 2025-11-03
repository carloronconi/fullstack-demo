"use client";

import {
  COUNTRY_CODES,
  type CountryCode,
  type CreateGreetingPayload,
  type Greeting,
} from "@fullstack-demo/contracts/greetings";
import { FormEvent, useCallback, useEffect, useState } from "react";

type SortOrder = "asc" | "desc";

const DEFAULT_API_URL = "http://localhost:3001";
const apiBase =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ?? DEFAULT_API_URL;
const API_BASE = apiBase;
const API_KEY = process.env.NEXT_PUBLIC_API_KEY ?? "my-secret-key";

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
  const [countryCode, setCountryCode] = useState<CountryCode>(
    COUNTRY_CODES[0]
  );
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

  const greetingsEndpoint = `${API_BASE}/greetings`;

  const fetchGreetings = useCallback(
    async (order: SortOrder) => {
      const res = await fetch(`${greetingsEndpoint}?sort=${order}`);
      if (!res.ok) {
        throw new Error(`Failed to load greetings (status ${res.status})`);
      }
      const payload = (await res.json()) as Greeting[];
      return payload.map((item) => ({
        ...item,
        createdAt: item.createdAt ?? new Date().toISOString(),
      }));
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
    <div className="w-full rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 sm:p-8">
      <div className="flex flex-col gap-8">
        <header className="flex flex-col gap-2">
          <h2 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
            Greetings playground
          </h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Interact with the NestJS greetings API: list, create, find, and
            delete greetings. Protect mutations with{" "}
            <code className="rounded bg-zinc-100 px-1 py-0.5 text-xs text-zinc-700 dark:bg-zinc-800 dark:text-zinc-200">
              X-API-KEY
            </code>
            .
          </p>
        </header>

        {flashMessage && (
          <div
            className={`rounded-lg border px-4 py-3 text-sm ${
              flashMessage.type === "success"
                ? "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/60 dark:bg-emerald-900/30 dark:text-emerald-200"
                : "border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-900/60 dark:bg-rose-900/30 dark:text-rose-200"
            }`}
          >
            {flashMessage.message}
          </div>
        )}

        <section className="flex flex-col gap-4 rounded-lg border border-zinc-200 p-4 dark:border-zinc-800">
          <h3 className="text-lg font-medium text-zinc-900 dark:text-zinc-50">
            Create greeting
          </h3>
          <form
            className="flex flex-col gap-3"
            onSubmit={handleCreate}
            noValidate
          >
            <label className="flex flex-col gap-1 text-sm text-zinc-600 dark:text-zinc-300">
              <span className="font-medium text-zinc-800 dark:text-zinc-100">
                Message
              </span>
              <input
                className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-base text-zinc-900 outline-none transition focus:border-zinc-500 focus:ring-2 focus:ring-zinc-200 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:focus:border-zinc-400 dark:focus:ring-zinc-800"
                placeholder="Say hello!"
                value={content}
                onChange={(event) => setContent(event.target.value)}
              />
            </label>

            <label className="flex flex-col gap-1 text-sm text-zinc-600 dark:text-zinc-300">
              <span className="font-medium text-zinc-800 dark:text-zinc-100">
                Country
              </span>
              <select
                className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-base text-zinc-900 outline-none transition focus:border-zinc-500 focus:ring-2 focus:ring-zinc-200 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:focus:border-zinc-400 dark:focus:ring-zinc-800"
                value={countryCode}
                onChange={(event) =>
                  setCountryCode(
                    event.target.value as CountryCode
                  )
                }
              >
                {COUNTRY_CODES.map((code) => (
                  <option key={code} value={code}>
                    {code}
                  </option>
                ))}
              </select>
            </label>

            {createError && (
              <p className="text-sm text-rose-600 dark:text-rose-400">
                {createError}
              </p>
            )}

            <button
              type="submit"
              className="inline-flex items-center justify-center rounded-md bg-zinc-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:ring-offset-2 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200 dark:focus:ring-zinc-400 dark:focus:ring-offset-zinc-900"
              disabled={createStatus === "submitting"}
            >
              {createStatus === "submitting" ? "Saving…" : "Create greeting"}
            </button>
          </form>
        </section>

        <section className="flex flex-col gap-4 rounded-lg border border-zinc-200 p-4 dark:border-zinc-800">
          <h3 className="text-lg font-medium text-zinc-900 dark:text-zinc-50">
            Lookup by id
          </h3>
          <form
            className="flex flex-col gap-3 sm:flex-row"
            onSubmit={handleLookupSubmit}
          >
            <input
              className="flex-1 rounded-md border border-zinc-300 bg-white px-3 py-2 text-base text-zinc-900 outline-none transition focus:border-zinc-500 focus:ring-2 focus:ring-zinc-200 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:focus:border-zinc-400 dark:focus:ring-zinc-800"
              placeholder="Enter greeting id"
              value={lookupId}
              onChange={(event) => setLookupId(event.target.value)}
            />
            <button
              type="submit"
              className="inline-flex items-center justify-center rounded-md bg-zinc-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:ring-offset-2 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200 dark:focus:ring-zinc-400 dark:focus:ring-offset-zinc-900"
              disabled={lookupStatus === "loading"}
            >
              {lookupStatus === "loading" ? "Searching…" : "Find greeting"}
            </button>
          </form>
          {lookupError && (
            <p className="text-sm text-rose-600 dark:text-rose-400">
              {lookupError}
            </p>
          )}
          {lookupResult && (
            <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-4 text-sm text-zinc-700 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200">
              <p>
                <span className="font-medium">Message:</span>{" "}
                {lookupResult.content}
              </p>
              <p>
                <span className="font-medium">Country:</span>{" "}
                {lookupResult.countryCode}
              </p>
              <p>
                <span className="font-medium">Created:</span>{" "}
                {new Date(lookupResult.createdAt).toLocaleString()}
              </p>
              <p className="wrap-break-word">
                <span className="font-medium">Id:</span> {lookupResult.id}
              </p>
            </div>
          )}
        </section>

        <section className="flex flex-col gap-4 rounded-lg border border-zinc-200 p-4 dark:border-zinc-800">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="text-lg font-medium text-zinc-900 dark:text-zinc-50">
                All greetings
              </h3>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                Sorted by creation time. Use actions above to add or remove
                greetings.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <label className="text-sm text-zinc-600 dark:text-zinc-300">
                Sort:
              </label>
              <select
                className="rounded-md border border-zinc-300 bg-white px-2 py-1 text-sm text-zinc-900 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
                value={sortOrder}
                onChange={(event) => {
                  const next = event.target.value as SortOrder;
                  setSortOrder(next);
                }}
              >
                <option value="desc">Newest first</option>
                <option value="asc">Oldest first</option>
              </select>
              <button
                type="button"
                onClick={() => refreshGreetings(sortOrder, { silent: true })}
                className="rounded-md border border-zinc-300 px-3 py-1 text-sm text-zinc-600 transition hover:border-zinc-400 hover:text-zinc-900 dark:border-zinc-700 dark:text-zinc-300 dark:hover:border-zinc-500 dark:hover:text-zinc-100"
                disabled={isRefreshing}
              >
                {isRefreshing ? "Refreshing…" : "Refresh"}
              </button>
            </div>
          </div>

          {listStatus === "loading" && (
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              Loading greetings…
            </p>
          )}

          {listStatus === "error" && listError && (
            <p className="text-sm text-rose-600 dark:text-rose-400">
              {listError}
            </p>
          )}

          {listStatus === "ready" && !hasGreetings && (
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              No greetings yet. Create one above!
            </p>
          )}

          {listStatus === "ready" && hasGreetings && (
            <ul className="flex flex-col gap-3">
              {greetings.map((greeting) => (
                <li
                  key={greeting.id}
                  className="flex flex-col gap-2 rounded-lg border border-zinc-200 p-4 text-sm text-zinc-700 dark:border-zinc-800 dark:text-zinc-200"
                >
                  <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
                    <p className="text-base font-medium text-zinc-900 dark:text-zinc-50">
                      {greeting.content}
                    </p>
                    <button
                      type="button"
                      className="self-start rounded-md border border-rose-200 px-3 py-1 text-xs font-medium text-rose-600 transition hover:border-rose-400 hover:text-rose-700 dark:border-rose-900/60 dark:text-rose-300 dark:hover:border-rose-800 dark:hover:text-rose-200"
                      onClick={() => handleDelete(greeting.id)}
                      disabled={deletingId === greeting.id}
                    >
                      {deletingId === greeting.id ? "Deleting…" : "Delete"}
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                    <span>Id: {greeting.id}</span>
                    <span>Country: {greeting.countryCode}</span>
                    <span>
                      Created: {new Date(greeting.createdAt).toLocaleString()}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>

        <footer className="text-sm text-zinc-500 dark:text-zinc-400">
          Update <code>NEXT_PUBLIC_API_URL</code> and{" "}
          <code>NEXT_PUBLIC_API_KEY</code> in <code>.env.local</code> if your
          backend lives elsewhere or uses a different key.
        </footer>
      </div>
    </div>
  );
}
