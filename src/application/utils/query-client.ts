import { QueryClient } from "@tanstack/react-query";

// Global QueryClient shared across the app; tweak defaults once workloads stabilize.
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 1000 * 30, // cache data for 30s by default
    },
    mutations: {
      retry: 1,
    },
  },
});

export const getQueryClient = () => queryClient;
