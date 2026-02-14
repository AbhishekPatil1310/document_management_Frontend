import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { authApi } from "../api/auth.api";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { clearAuthenticated } from "../app/authSlice";
import { useToast } from "../components/ui/ToastProvider";

const navItemClasses = ({ isActive }: { isActive: boolean }) =>
  `rounded-lg px-3 py-2 text-sm font-medium ${
    isActive
      ? "bg-brand-500 text-white"
      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
  }`;

export const DashboardLayout = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { pushToast } = useToast();
  const userId = useAppSelector((state) => state.auth.user?.userId);

  const handleLogout = async () => {
    try {
      await authApi.logout();
    } finally {
      dispatch(clearAuthenticated());
      navigate("/login", { replace: true });
    }
  };

  return (
    <div className="min-h-screen">
      <header className="border-b border-slate-200 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <div>
            <h1 className="text-lg font-semibold text-slate-900">Legal Vault</h1>
            <p className="text-xs text-slate-500">User ID: {userId}</p>
          </div>
          <div className="flex items-center gap-2">
            <NavLink to="/" end className={navItemClasses}>
              Documents
            </NavLink>
            <NavLink to="/sessions" className={navItemClasses}>
              Sessions
            </NavLink>
            <button
              className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
              onClick={() =>
                handleLogout().catch(() => pushToast("Logout failed", "error"))
              }
            >
              Logout
            </button>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-6">
        <Outlet />
      </main>
    </div>
  );
};
