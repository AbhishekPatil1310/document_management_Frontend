import { lazy } from "react";
import { createBrowserRouter } from "react-router-dom";
import { RootLayout } from "../layouts/RootLayout";
import { AuthLayout } from "../layouts/AuthLayout";
import { DashboardLayout } from "../layouts/DashboardLayout";
import { ProtectedRoute } from "./ProtectedRoute";
import { PublicOnlyRoute } from "./PublicOnlyRoute";
import { LazyPage } from "./LazyPage";

const LoginPage = lazy(() => import("../pages/LoginPage"));
const RegisterPage = lazy(() => import("../pages/RegisterPage"));
const ForgotPasswordPage = lazy(() => import("../pages/ForgotPasswordPage"));
const ResetPasswordPage = lazy(() => import("../pages/ResetPasswordPage"));
const DashboardPage = lazy(() => import("../pages/DashboardPage"));
const SessionsPage = lazy(() => import("../pages/SessionsPage"));
const NotFoundPage = lazy(() => import("../pages/NotFoundPage"));

export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      {
        element: <PublicOnlyRoute />,
        children: [
          {
            element: <AuthLayout />,
            children: [
              { path: "login", element: <LazyPage Page={LoginPage} /> },
              { path: "register", element: <LazyPage Page={RegisterPage} /> },
              {
                path: "forgot-password",
                element: <LazyPage Page={ForgotPasswordPage} />
              },
              {
                path: "reset-password",
                element: <LazyPage Page={ResetPasswordPage} />
              }
            ]
          }
        ]
      },
      {
        element: <ProtectedRoute />,
        children: [
          {
            element: <DashboardLayout />,
            children: [
              { index: true, element: <LazyPage Page={DashboardPage} /> },
              { path: "sessions", element: <LazyPage Page={SessionsPage} /> }
            ]
          }
        ]
      },
      { path: "*", element: <LazyPage Page={NotFoundPage} /> }
    ]
  }
]);
