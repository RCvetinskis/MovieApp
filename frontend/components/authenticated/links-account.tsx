"use client";
import ButtonTitleIcon from "../buttons/button-icon-title";
import { Bell, LogOut, Settings } from "lucide-react";
import useLogout from "@/hooks/useLogout";
import TitleSkeleton from "../skeletons/title-skeleton";
import BtnSkeleton from "../skeletons/btn-skeleton";
import { useRouter } from "next/navigation";

const LinksAccount = () => {
  const logout = useLogout();
  const router = useRouter();
  return (
    <div>
      <h2 className="font-semibold">Account</h2>
      <div className="flex flex-col">
        <ButtonTitleIcon
          title="Notifications"
          handleClick={() => console.log("test")}
        >
          <Bell />
        </ButtonTitleIcon>

        <ButtonTitleIcon
          title="Profile Settings"
          handleClick={() => router.push("/profile/settings")}
        >
          <Settings />
        </ButtonTitleIcon>

        <ButtonTitleIcon title="Logout" handleClick={logout}>
          <LogOut />
        </ButtonTitleIcon>
      </div>
    </div>
  );
};

export default LinksAccount;

export const LinksAccountSkeleton = () => {
  return (
    <div className="space-y-2">
      <TitleSkeleton />

      <div className="flex flex-col gap-3">
        {[...Array(3)].map((_, i) => (
          <BtnSkeleton key={i} />
        ))}
      </div>
    </div>
  );
};
