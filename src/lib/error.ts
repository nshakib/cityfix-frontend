export function getErrorMessage(err: unknown, fallback: string): string {
  const message = (err as { data?: { message?: unknown } } | null)?.data
    ?.message;
  return typeof message === "string" && message ? message : fallback;
}