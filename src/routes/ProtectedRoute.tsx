import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAppSelector } from "../app/hooks";

export const ProtectedRoute = () => {
  const location = useLocation();
  const { isAuthenticated, bootstrapped } = useAppSelector((state) => state.auth);

  if (!bootstrapped) {
    return (
      <div className="mx-auto max-w-5xl p-6">
        <div className="h-10 w-44 animate-pulse rounded-md bg-slate-200" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
};
