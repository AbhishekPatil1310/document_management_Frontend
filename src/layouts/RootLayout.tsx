import { Outlet } from "react-router-dom";
import { NetworkBanner } from "../components/ui/NetworkBanner";
import { useAuthBootstrap } from "../features/auth/hooks/useAuthBootstrap";

export const RootLayout = () => {
  useAuthBootstrap();

  return (
    <>
      <NetworkBanner />
      <Outlet />
    </>
  );
};
