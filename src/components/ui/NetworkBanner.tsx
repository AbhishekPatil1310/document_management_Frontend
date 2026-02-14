import { useNetworkStatus } from "../../hooks/useNetworkStatus";

export const NetworkBanner = () => {
  const { isOnline } = useNetworkStatus();
  if (isOnline) return null;

  return (
    <div className="sticky top-0 z-40 w-full bg-amber-500 px-4 py-2 text-center text-sm font-medium text-slate-900">
      You are offline. Changes that require network access may fail.
    </div>
  );
};
