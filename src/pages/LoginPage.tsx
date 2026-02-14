import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { authApi } from "../api/auth.api";
import { useAppDispatch } from "../app/hooks";
import { setAuthenticated } from "../app/authSlice";
import { useLogin } from "../features/auth/hooks/useAuthMutations";
import { useToast } from "../components/ui/ToastProvider";
import { normalizeApiError } from "../api/errors";
import { validateEmail, validatePassword } from "../utils/validation";

type LocationState = {
  from?: { pathname?: string };
};

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const { pushToast } = useToast();
  const loginMutation = useLogin();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const emailErr = validateEmail(email);
    const passErr = validatePassword(password);
    if (emailErr || passErr) {
      setError(emailErr || passErr);
      return;
    }

    setError("");
    try {
      await loginMutation.mutateAsync({ email, password });
      const me = await authApi.me();
      dispatch(setAuthenticated({ userId: me.userId }));
      pushToast("Logged in successfully", "success");
      const nextPath = (location.state as LocationState)?.from?.pathname || "/";
      navigate(nextPath, { replace: true });
    } catch (err) {
      setError(normalizeApiError(err).message);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold text-slate-900">Welcome back</h2>
      <p className="mt-1 text-sm text-slate-600">Sign in to access your legal vault.</p>

      <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
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
        <label className="block">
          <span className="mb-1 block text-sm font-medium text-slate-700">Password</span>
          <input
            aria-label="Password"
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </label>
        {error ? <p className="text-sm text-rose-600">{error}</p> : null}
        <button
          className="w-full rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700 disabled:opacity-70"
          type="submit"
          disabled={loginMutation.isPending}
        >
          {loginMutation.isPending ? "Signing in..." : "Sign in"}
        </button>
      </form>

      <div className="mt-4 flex justify-between text-sm">
        <Link className="text-brand-700 hover:underline" to="/register">
          Create account
        </Link>
        <Link className="text-brand-700 hover:underline" to="/forgot-password">
          Forgot password?
        </Link>
      </div>
    </div>
  );
}
