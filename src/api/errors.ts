export type ApiError = {
  message: string;
  status?: number;
  details?: unknown;
};

export const normalizeApiError = (error: unknown): ApiError => {
  if (typeof error === "object" && error !== null) {
    const err = error as {
      response?: { status?: number; data?: { message?: string; errors?: unknown } };
      message?: string;
    };
    return {
      message:
        err.response?.data?.message || err.message || "Unexpected network error",
      status: err.response?.status,
      details: err.response?.data?.errors
    };
  }
  return { message: "Unexpected network error" };
};
