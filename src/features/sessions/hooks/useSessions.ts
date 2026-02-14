import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { authApi } from "../../../api/auth.api";
import { sessionsApi } from "../../../api/sessions.api";

export const useSessions = () =>
  useQuery({
    queryKey: ["sessions"],
    queryFn: sessionsApi.list,
    staleTime: 20_000
  });

export const useRevokeSession = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (sessionId: string) => sessionsApi.revoke(sessionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sessions"] });
    }
  });
};

export const useLogoutAllDevices = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authApi.logoutAll,
    onSuccess: () => {
      queryClient.clear();
    }
  });
};
