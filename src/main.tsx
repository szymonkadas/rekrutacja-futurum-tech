import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Toaster } from "react-hot-toast";
import "/src/index.css";
import App from "/src/App.tsx";
import { getQueryClient } from "/src/application/utils/query-client.ts";

const queryClient = getQueryClient();
const TOAST_BASE_STYLE = {
  background: "var(--color-bg-card)",
  color: "var(--color-text)",
  border: "1px solid var(--color-border-default)",
  borderRadius: "var(--radius-md)",
  padding: "var(--space-6) var(--space-8)",
  boxShadow: "var(--shadow-card)",
};

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
      <ReactQueryDevtools buttonPosition="bottom-left" />
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: TOAST_BASE_STYLE,
          success: {
            iconTheme: {
              primary: "var(--color-success)",
              secondary: "var(--color-bg-card)",
            },
            style: {
              borderColor: "var(--color-success)",
            },
          },
          error: {
            iconTheme: {
              primary: "var(--color-error)",
              secondary: "var(--color-bg-card)",
            },
            style: {
              borderColor: "var(--color-error)",
            },
          },
        }}
      />
    </QueryClientProvider>
  </StrictMode>,
);
