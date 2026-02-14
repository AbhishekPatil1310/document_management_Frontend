import { Navigate, Outlet } from "react-router-dom";
import { useAppSelector } from "../app/hooks";

export const PublicOnlyRoute = () => {
  const { isAuthenticated, bootstrapped } = useAppSelector((state) => state.auth);

  if (!bootstrapped) {
    return (
      <div className="mx-auto max-w-5xl p-6">
        <div className="h-10 w-44 animate-pulse rounded-md bg-slate-200" />
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};
