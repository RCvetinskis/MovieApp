import OpenDrawer, {
  OpenDrawerHeaderSkeleton,
} from "@/components/toolbar/open-drawer";
import { CardContent } from "@/components/ui/card";
import LinksLists, { LinksListSkeleton } from "../links-lists";
import LinksAccount, { LinksAccountSkeleton } from "../links-account";
const ProfileSideBar = () => {
  return (
    <aside className="hidden md:block w-[240px]">
      <OpenDrawer title="My Dashboard">
        <CardContent className="p-2 pb-4 space-y-2  ">
          <LinksLists />
          <LinksAccount />
        </CardContent>
      </OpenDrawer>
    </aside>
  );
};

export default ProfileSideBar;

export const ProfileSideBarSkeleton = () => {
  return (
    <aside className="hidden md:block w-[240px] bg-card rounded-xl">
      <OpenDrawerHeaderSkeleton />

      <div className="p-2 pb-4 space-y-2">
        <LinksListSkeleton />
        <LinksAccountSkeleton />
      </div>
    </aside>
  );
};
