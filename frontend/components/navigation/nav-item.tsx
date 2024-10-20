import { Route } from "@/types";
import Link from "next/link";
import { Skeleton } from "../ui/skeleton";
import HoverLabel from "../hover-label";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";

type Props = {
  route: Route;
};

const NavItem = ({ route }: Props) => {
  const Component = route.Component;
  return (
    <HoverLabel align="end" asChild label={route.label}>
      <div className={cn(route.active && " border-b-2 border-primary")}>
        {route.href ? (
          <Link href={route.href}>
            <Component className="w-6 h-6" />
          </Link>
        ) : (
          <Component className="w-6 h-6" />
        )}
      </div>
    </HoverLabel>
  );
};

export default NavItem;

export const NavItemSkeleton = () => {
  return <Skeleton className="h-6 w-6  bg-gray-400 rounded-full" />;
};
