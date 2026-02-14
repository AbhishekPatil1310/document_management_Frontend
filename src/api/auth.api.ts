import { apiClient } from "./axios";

export type AuthPayload = {
  email: string;
  password: string;
};

export type ResetPasswordPayload = {
  token: string;
  newPassword: string;
};

export const authApi = {
  register: async (payload: AuthPayload) => {
    const { data } = await apiClient.post<{ message: string }>(
      "/auth/register",
      payload
    );
    return data;
  },
  login: async (payload: AuthPayload) => {
    const { data } = await apiClient.post<{ message: string }>("/auth/login", payload);
    return data;
  },
  me: async () => {
    const { data } = await apiClient.get<{ userId: string }>("/auth/me");
    return data;
  },
  logout: async () => {
    const { data } = await apiClient.post<{ message: string }>("/auth/logout");
    return data;
  },
  logoutAll: async () => {
    const { data } = await apiClient.post<{ message: string }>("/auth/logout-all");
    return data;
  },
  forgotPassword: async (email: string) => {
    const { data } = await apiClient.post<{ message: string }>("/auth/forgot-password", {
      email
    });
    return data;
  },
  resetPassword: async (payload: ResetPasswordPayload) => {
    const { data } = await apiClient.post<{ message: string }>(
      "/auth/reset-password",
      payload
    );
    return data;
  }
};
