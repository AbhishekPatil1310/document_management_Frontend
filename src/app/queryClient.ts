import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60_000,
      gcTime: 5 * 60_000,
      retry: (count, error: unknown) => {
        const status = (error as { status?: number })?.status;
        if (status && status >= 400 && status < 500 && status !== 429) {
          return false;
        }
        return count < 2;
      },
      refetchOnWindowFocus: false
    }
  }
});
