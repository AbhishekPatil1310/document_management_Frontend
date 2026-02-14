import { useEffect, useRef, type ReactNode } from "react";
import { Provider } from "react-redux";
import { QueryClientProvider } from "@tanstack/react-query";
import { store } from "./store";
import { queryClient } from "./queryClient";
import { setupApiInterceptors } from "../api/axios";
import { ToastProvider } from "../components/ui/ToastProvider";
import { ErrorBoundary } from "../components/ErrorBoundary";

export const AppProviders = ({ children }: { children: ReactNode }) => {
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;
    setupApiInterceptors(store.dispatch, () => {
      window.location.assign("/login");
    });
  }, []);

  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <ToastProvider>
          <ErrorBoundary>{children}</ErrorBoundary>
        </ToastProvider>
      </QueryClientProvider>
    </Provider>
  );
};
