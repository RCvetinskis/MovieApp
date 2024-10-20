import { getUserById } from "@/actions/backend/user";
import { ProfileSideBarSkeleton } from "@/components/authenticated/profileToolBar/profile-side-bar";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { lazy, Suspense } from "react";

type Props = {
  children: React.ReactNode;
};

const ProfileLayout = async ({ children }: Props) => {
  const ProfileSideBar = lazy(
    () => import("@/components/authenticated/profileToolBar/profile-side-bar")
  );
  const cookieStore = cookies();
  const userId = cookieStore.get("userId")?.value;

  if (!userId) redirect("/login");
  const user = await getUserById(userId);
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
