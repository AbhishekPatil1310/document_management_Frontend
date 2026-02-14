import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <div className="mx-auto flex min-h-screen max-w-xl flex-col items-center justify-center p-6 text-center">
      <h1 className="text-4xl font-semibold text-slate-900">404</h1>
      <p className="mt-2 text-sm text-slate-600">The page you requested was not found.</p>
      <Link
        className="mt-4 rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700"
        to="/"
      >
        Go to dashboard
      </Link>
    </div>
  );
}
