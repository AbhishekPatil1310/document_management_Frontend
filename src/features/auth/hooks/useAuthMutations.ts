import { useMutation } from "@tanstack/react-query";
import { authApi, type AuthPayload, type ResetPasswordPayload } from "../../../api/auth.api";

export const useLogin = () => useMutation({ mutationFn: (payload: AuthPayload) => authApi.login(payload) });
export const useRegister = () =>
  useMutation({ mutationFn: (payload: AuthPayload) => authApi.register(payload) });
export const useForgotPassword = () =>
  useMutation({ mutationFn: (email: string) => authApi.forgotPassword(email) });
export const useResetPassword = () =>
  useMutation({
    mutationFn: (payload: ResetPasswordPayload) => authApi.resetPassword(payload)
  });
