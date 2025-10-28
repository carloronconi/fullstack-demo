"use client";

import { useEffect, useMemo, useState } from "react";

type BackendResponse = {
  message: string;
  timestamp: string;
};

type RequestStatus =
  | { type: "loading" }
  | { type: "error"; error: string }
  | { type: "success"; data: BackendResponse };

const defaultApiUrl = "http://localhost:3001";

function buildApiUrl() {
  const base =
    process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ?? defaultApiUrl;
  return `${base}/api/hello`;
}

export function BackendMessage() {
  const [requestStatus, setRequestStatus] = useState<RequestStatus>({
    type: "loading",
  });

  const requestUrl = useMemo(() => buildApiUrl(), []);

  useEffect(() => {
    const controller = new AbortController();

    async function loadMessage() {
      try {
        const res = await fetch(requestUrl, {
          signal: controller.signal,
        });

        if (!res.ok) {
          throw new Error(`Request failed with status ${res.status}`);
        }

        const payload = (await res.json()) as BackendResponse;
        setRequestStatus({ type: "success", data: payload });
      } catch (err) {
        if ((err as Error).name === "AbortError") {
          return;
        }
        setRequestStatus({ type: "error", error: (err as Error).message });
      }
    }

    loadMessage();

    return () => controller.abort();
  }, [requestUrl]);

  return (
    <div className="w-full rounded-lg border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
      <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
        Backend says:
      </h2>
      {requestStatus.type === "loading" && (
        <p className="mt-3 text-zinc-600 dark:text-zinc-400">Loading…</p>
      )}
      {requestStatus.type === "error" && (
        <p className="mt-3 text-rose-600 dark:text-rose-400">
          Could not reach the backend: {requestStatus.error}
        </p>
      )}
      {requestStatus.type === "success" && (
        <>
          <p className="mt-3 text-lg text-zinc-900 dark:text-zinc-50">
            {requestStatus.data.message}
          </p>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            Retrieved at{" "}
            {new Date(requestStatus.data.timestamp).toLocaleTimeString()}
          </p>
        </>
      )}
      <p className="mt-6 text-sm text-zinc-500 dark:text-zinc-400">
        Update `NEXT_PUBLIC_API_URL` in `apps/frontend/.env.local` if you run
        the backend somewhere else.
      </p>
    </div>
  );
}
