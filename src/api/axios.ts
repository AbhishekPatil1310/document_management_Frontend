import axios, {
  AxiosError,
  type AxiosInstance,
  type InternalAxiosRequestConfig
} from "axios";
import { clearAuthenticated, setAuthenticated } from "../app/authSlice";
import type { AppDispatch } from "../app/store";
import { normalizeApiError } from "./errors";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL?.trim() || "http://localhost:4000/api";

type RetryableConfig = InternalAxiosRequestConfig & {
  _retry?: boolean;
};

let refreshPromise: Promise<void> | null = null;
let storeDispatch: AppDispatch | null = null;
let onAuthFail: (() => void) | null = null;

export const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  timeout: 15_000,
  headers: {
    "Content-Type": "application/json"
  }
});

const shouldSkipRefresh = (url?: string) =>
  !!url &&
  (url.includes("/auth/login") ||
    url.includes("/auth/register") ||
    url.includes("/auth/refresh") ||
    url.includes("/auth/forgot-password") ||
    url.includes("/auth/reset-password"));

const refreshSession = async (): Promise<void> => {
  if (!refreshPromise) {
    refreshPromise = apiClient
      .post("/auth/refresh")
      .then(async () => {
        const me = await apiClient.get<{ userId: string }>("/auth/me");
        storeDispatch?.(setAuthenticated({ userId: me.data.userId }));
      })
      .finally(() => {
        refreshPromise = null;
      });
  }
  return refreshPromise;
};

export const setupApiInterceptors = (dispatch: AppDispatch, onFailure: () => void) => {
  storeDispatch = dispatch;
  onAuthFail = onFailure;

  apiClient.interceptors.request.use((config) => config);

  apiClient.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
      const normalized = normalizeApiError(error);
      const originalRequest = error.config as RetryableConfig | undefined;
      const status = error.response?.status;

      if (
        status === 401 &&
        originalRequest &&
        !originalRequest._retry &&
        !shouldSkipRefresh(originalRequest.url)
      ) {
        originalRequest._retry = true;
        try {
          await refreshSession();
          return apiClient(originalRequest);
        } catch {
          storeDispatch?.(clearAuthenticated());
          onAuthFail?.();
        }
      }

      return Promise.reject({ ...normalized, original: error });
    }
  );
};
