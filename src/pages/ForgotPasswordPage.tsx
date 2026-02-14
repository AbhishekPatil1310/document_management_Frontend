import { useState } from "react";
import { Link } from "react-router-dom";
import { useForgotPassword } from "../features/auth/hooks/useAuthMutations";
import { normalizeApiError } from "../api/errors";
import { validateEmail } from "../utils/validation";
import { useToast } from "../components/ui/ToastProvider";

export default function ForgotPasswordPage() {
  const { pushToast } = useToast();
  const forgotMutation = useForgotPassword();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const emailErr = validateEmail(email);
    if (emailErr) {
      setError(emailErr);
      return;
    }
    setError("");

    try {
      const result = await forgotMutation.mutateAsync(email);
      pushToast(result.message, "info");
    } catch (err) {
      setError(normalizeApiError(err).message);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold text-slate-900">Forgot password</h2>
      <p className="mt-1 text-sm text-slate-600">
        Enter your email. If it exists, a reset link will be issued.
      </p>
      <form className="mt-6 space-y-4" onSubmit={onSubmit}>
        <label className="block">
          <span className="mb-1 block text-sm font-medium text-slate-700">Email</span>
          <input
            aria-label="Email address"
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
        </label>
        {error ? <p className="text-sm text-rose-600">{error}</p> : null}
        <button
          className="w-full rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700 disabled:opacity-70"
          type="submit"
          disabled={forgotMutation.isPending}
        >
          {forgotMutation.isPending ? "Sending..." : "Send reset link"}
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
