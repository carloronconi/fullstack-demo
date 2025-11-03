const FALLBACK_MESSAGE =
  "BACKEND_ORIGIN is not configured. Set it in apps/frontend/.env";

export function getBackendOrigin(): string {
  const origin = process.env.BACKEND_ORIGIN;
  if (!origin) {
    throw new Error(FALLBACK_MESSAGE);
  }
  return origin.replace(/\/$/, "");
}
