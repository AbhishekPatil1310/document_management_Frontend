import { apiClient } from "./axios";

export type SessionItem = {
  id: string;
  ip_address: string | null;
  user_agent: string | null;
  created_at: string;
  expires_at: string;
};

export const sessionsApi = {
  list: async () => {
    const { data } = await apiClient.get<{ sessions: SessionItem[] }>("/auth/sessions");
    return data.sessions;
  },
  revoke: async (sessionId: string) => {
    const { data } = await apiClient.delete<{ message: string }>(
      `/auth/sessions/${sessionId}`
    );
    return data;
  }
};
