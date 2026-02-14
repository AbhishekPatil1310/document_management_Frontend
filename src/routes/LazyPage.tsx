import { Suspense, type LazyExoticComponent, type ComponentType } from "react";
import { RouteLoader } from "../components/RouteLoader";

type LazyPageProps = {
  Page: LazyExoticComponent<ComponentType>;
};

export const LazyPage = ({ Page }: LazyPageProps) => (
  <Suspense fallback={<RouteLoader />}>
    <Page />
  </Suspense>
);
