import { SideBarSkeleton } from "@/components/toolbar/sidebar";
import { lazy, Suspense } from "react";
type Props = {
  children: React.ReactNode;
};

const MoviesAndTvLayout = ({ children }: Props) => {
  const SideBar = lazy(() => import("@/components/toolbar/sidebar"));
  return (
    <div className="flex">
      <Suspense fallback={<SideBarSkeleton />}>
        <SideBar />
      </Suspense>

      <main className="flex-1  px-4">{children}</main>
    </div>
  );
};

export default MoviesAndTvLayout;
