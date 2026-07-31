import axios from 'axios';

/**
 * Extracts a human-readable message from an axios error.
 * Falls back to the provided fallback string if no message is found.
 */
export function getApiErrorMessage(err: unknown, fallback: string): string {
  if (axios.isAxiosError(err)) {
    return (err.response?.data as { message?: string })?.message ?? fallback;
  }
  if (err instanceof Error) return err.message;
  return fallback;
}
