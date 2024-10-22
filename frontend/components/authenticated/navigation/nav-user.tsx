"use client";
import { Button } from "../../ui/button";
import { NavItemSkeleton } from "../../navigation/nav-item";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { timeAgo } from "@/lib/utils";
import Link from "next/link";
import LinksLists from "../links-lists";
import LinksAccount from "../links-account";
import UserAvatar from "../user-avatar";
import { useUserStore } from "@/store/store-user";

const NavUser = () => {
  const { user } = useUserStore();
  return (
    <>
      {user ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              className="p-0 px-2 rounded-full "
              variant={"ghost"}
              size={"sm"}
            >
              <UserAvatar imageUrl={user.profileImageUrl} />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent>
            <Link href={"/profile"}>
              <DropdownMenuItem className="hover:cursor-pointer">
                <div className="flex items-center gap-3">
                  <UserAvatar imageUrl={user.profileImageUrl} />
                  <DropdownMenuLabel className="text-center capitalize font-semibold">
                    {user.userName}
                  </DropdownMenuLabel>
                </div>
              </DropdownMenuItem>
            </Link>

            <DropdownMenuSeparator />
            <LinksLists />

            <DropdownMenuSeparator />
            <LinksAccount />

            <DropdownMenuSeparator />
            <DropdownMenuLabel className="text-sm text-muted-foreground">
              Last login {timeAgo(user.lastLogin)}
            </DropdownMenuLabel>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <NavItemSkeleton />
      )}
    </>
  );
};

export default NavUser;
