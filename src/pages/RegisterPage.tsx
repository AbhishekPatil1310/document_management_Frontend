import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { normalizeApiError } from "../api/errors";
import { useRegister } from "../features/auth/hooks/useAuthMutations";
import { useToast } from "../components/ui/ToastProvider";
import { validateEmail, validatePassword } from "../utils/validation";

export default function RegisterPage() {
  const navigate = useNavigate();
  const { pushToast } = useToast();
  const registerMutation = useRegister();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const emailErr = validateEmail(email);
    const passErr = validatePassword(password);
    if (emailErr || passErr) {
      setError(emailErr || passErr);
      return;
    }
    setError("");
    try {
      await registerMutation.mutateAsync({ email, password });
      pushToast("Registration successful. Please sign in.", "success");
      navigate("/login", { replace: true });
    } catch (err) {
      setError(normalizeApiError(err).message);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold text-slate-900">Create account</h2>
      <p className="mt-1 text-sm text-slate-600">Start storing legal files securely.</p>
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
        <label className="block">
          <span className="mb-1 block text-sm font-medium text-slate-700">Password</span>
          <input
            aria-label="Password"
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
            type="password"
            autoComplete="new-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </label>
        {error ? <p className="text-sm text-rose-600">{error}</p> : null}
        <button
          className="w-full rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700 disabled:opacity-70"
          type="submit"
          disabled={registerMutation.isPending}
        >
          {registerMutation.isPending ? "Creating..." : "Create account"}
        </button>
      </form>
      <p className="mt-4 text-sm text-slate-600">
        Already have an account?{" "}
        <Link className="text-brand-700 hover:underline" to="/login">
          Sign in
        </Link>
      </p>
    </div>
  );
}
