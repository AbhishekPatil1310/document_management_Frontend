import { useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useResetPassword } from "../features/auth/hooks/useAuthMutations";
import { normalizeApiError } from "../api/errors";
import { validatePassword } from "../utils/validation";
import { useToast } from "../components/ui/ToastProvider";

export default function ResetPasswordPage() {
  const navigate = useNavigate();
  const { pushToast } = useToast();
  const [params] = useSearchParams();
  const token = useMemo(() => params.get("token") || "", [params]);
  const resetMutation = useResetPassword();

  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState("");

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const passErr = validatePassword(newPassword);
    if (passErr) {
      setError(passErr);
      return;
    }
    if (!token) {
      setError("Invalid reset token.");
      return;
    }
    setError("");
    try {
      await resetMutation.mutateAsync({ token, newPassword });
      pushToast("Password reset successful. Please sign in.", "success");
      navigate("/login", { replace: true });
    } catch (err) {
      setError(normalizeApiError(err).message);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold text-slate-900">Reset password</h2>
      <p className="mt-1 text-sm text-slate-600">
        Set a new password for your account.
      </p>
      <form className="mt-6 space-y-4" onSubmit={onSubmit}>
        <label className="block">
          <span className="mb-1 block text-sm font-medium text-slate-700">
            New password
          </span>
          <input
            aria-label="New password"
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
            type="password"
            autoComplete="new-password"
            value={newPassword}
            onChange={(event) => setNewPassword(event.target.value)}
          />
        </label>
        {error ? <p className="text-sm text-rose-600">{error}</p> : null}
        <button
          className="w-full rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700 disabled:opacity-70"
          type="submit"
          disabled={resetMutation.isPending}
        >
          {resetMutation.isPending ? "Updating..." : "Reset password"}
        </button>
      </form>
      <p className="mt-4 text-sm text-slate-600">
        <Link className="text-brand-700 hover:underline" to="/login">
          Back to login
        </Link>
      </p>
    </div>
  );
}
