import { Outlet } from "react-router-dom";

export const AuthLayout = () => (
  <div className="flex min-h-screen items-center justify-center px-4 py-10">
    <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-soft sm:p-8">
      <Outlet />
    </div>
  </div>
);
