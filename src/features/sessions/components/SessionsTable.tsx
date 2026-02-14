import { memo } from "react";
import type { SessionItem } from "../../../api/sessions.api";
import { formatDateTime, truncate } from "../../../utils/format";

type SessionsTableProps = {
  sessions: SessionItem[];
  onRevoke: (sessionId: string) => void;
  pendingSessionId?: string | null;
};

const SessionsTableComponent = ({
  sessions,
  onRevoke,
  pendingSessionId
}: SessionsTableProps) => (
  <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-soft">
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-slate-200">
        <thead className="bg-slate-50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-slate-500">
              Device
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-slate-500">
              IP
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-slate-500">
              Created
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-slate-500">
              Expires
            </th>
            <th className="px-4 py-3 text-right text-xs font-semibold uppercase text-slate-500">
              Action
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {sessions.map((session) => {
            const isLikelyCurrent = !!session.user_agent?.includes(navigator.userAgent);
            return (
              <tr key={session.id} className="hover:bg-slate-50">
                <td className="px-4 py-3 text-sm text-slate-700">
                  <div className="max-w-[320px]">
                    <p title={session.user_agent || ""}>
                      {truncate(session.user_agent || "Unknown device", 65)}
                    </p>
                    {isLikelyCurrent ? (
                      <span className="mt-1 inline-block rounded bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700">
                        Likely current session
                      </span>
                    ) : null}
                  </div>
                </td>
                <td className="px-4 py-3 text-sm text-slate-600">
                  {session.ip_address || "Unknown"}
                </td>
                <td className="px-4 py-3 text-sm text-slate-600">
                  {formatDateTime(session.created_at)}
                </td>
                <td className="px-4 py-3 text-sm text-slate-600">
                  {formatDateTime(session.expires_at)}
                </td>
                <td className="px-4 py-3 text-right">
                  <button
                    className="rounded-md border border-rose-300 px-3 py-1.5 text-xs font-medium text-rose-600 hover:bg-rose-50 disabled:opacity-70"
                    onClick={() => onRevoke(session.id)}
                    disabled={pendingSessionId === session.id}
                  >
                    {pendingSessionId === session.id ? "Revoking..." : "Revoke"}
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  </div>
);

export const SessionsTable = memo(SessionsTableComponent);
