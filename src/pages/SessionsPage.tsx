import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { clearAuthenticated } from "../app/authSlice";
import { useAppDispatch } from "../app/hooks";
import { normalizeApiError } from "../api/errors";
import { useToast } from "../components/ui/ToastProvider";
import { ConfirmDialog } from "../components/ui/ConfirmDialog";
import { EmptyState } from "../components/ui/EmptyState";
import { TableSkeleton } from "../components/ui/LoadingSkeleton";
import { QueryErrorState } from "../components/ui/QueryErrorState";
import { SessionsTable } from "../features/sessions/components/SessionsTable";
import {
  useLogoutAllDevices,
  useRevokeSession,
  useSessions
} from "../features/sessions/hooks/useSessions";

export default function SessionsPage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { pushToast } = useToast();
  const sessionsQuery = useSessions();
  const revokeMutation = useRevokeSession();
  const logoutAllMutation = useLogoutAllDevices();
  const [revokeTarget, setRevokeTarget] = useState<string | null>(null);
  const [showLogoutAllConfirm, setShowLogoutAllConfirm] = useState(false);

  const onRevokeConfirm = async () => {
    if (!revokeTarget) return;
    try {
      await revokeMutation.mutateAsync(revokeTarget);
      pushToast("Session revoked", "success");
      setRevokeTarget(null);
    } catch (err) {
      pushToast(normalizeApiError(err).message, "error");
    }
  };

  const onLogoutAllConfirm = async () => {
    try {
      await logoutAllMutation.mutateAsync();
      dispatch(clearAuthenticated());
      pushToast("Logged out from all devices", "success");
      navigate("/login", { replace: true });
    } catch (err) {
      pushToast(normalizeApiError(err).message, "error");
    }
  };

  return (
    <div className="space-y-4">
      <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-soft">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-base font-semibold text-slate-900">Session management</h2>
            <p className="text-sm text-slate-600">
              Review device sessions by IP and revoke suspicious access.
            </p>
          </div>
          <button
            className="rounded-lg border border-rose-300 px-4 py-2 text-sm font-medium text-rose-600 hover:bg-rose-50"
            onClick={() => setShowLogoutAllConfirm(true)}
          >
            Logout all devices
          </button>
        </div>
      </section>

      {sessionsQuery.isPending ? <TableSkeleton rows={5} /> : null}

      {sessionsQuery.isError ? (
        <QueryErrorState
          message={normalizeApiError(sessionsQuery.error).message}
          onRetry={() => sessionsQuery.refetch()}
        />
      ) : null}

      {!sessionsQuery.isPending && !sessionsQuery.isError ? (
        (sessionsQuery.data?.length || 0) === 0 ? (
          <EmptyState
            title="No active sessions"
            description="Your account currently has no active refresh-token sessions."
          />
        ) : (
          <SessionsTable
            sessions={sessionsQuery.data || []}
            onRevoke={(sessionId) => setRevokeTarget(sessionId)}
            pendingSessionId={
              revokeMutation.isPending ? (revokeMutation.variables ?? null) : null
            }
          />
        )
      ) : null}

      <ConfirmDialog
        isOpen={!!revokeTarget}
        title="Revoke session"
        description="This session will be logged out immediately and cannot refresh tokens."
        confirmLabel="Revoke"
        danger
        isLoading={revokeMutation.isPending}
        onCancel={() => setRevokeTarget(null)}
        onConfirm={onRevokeConfirm}
      />

      <ConfirmDialog
        isOpen={showLogoutAllConfirm}
        title="Logout all devices"
        description="This will invalidate every session and require sign in again on all devices."
        confirmLabel="Logout all"
        danger
        isLoading={logoutAllMutation.isPending}
        onCancel={() => setShowLogoutAllConfirm(false)}
        onConfirm={onLogoutAllConfirm}
      />
    </div>
  );
}
