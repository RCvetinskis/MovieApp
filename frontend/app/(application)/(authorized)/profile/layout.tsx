import { ProfileSideBarSkeleton } from "@/components/authenticated/profileToolBar/profile-side-bar";
import { lazy, Suspense } from "react";

type Props = {
  children: React.ReactNode;
};

const ProfileLayout = ({ children }: Props) => {
  const ProfileSideBar = lazy(
    () => import("@/components/authenticated/profileToolBar/profile-side-bar")
  );

  return (
    <div className="flex">
      <Suspense fallback={<ProfileSideBarSkeleton />}>
        <ProfileSideBar />
      </Suspense>

      <main className="flex-1  bg-card p-4 md:p-6 shadow-input rounded-xl">
        {children}
      </main>
    </div>
  );
};

export default ProfileLayout;
