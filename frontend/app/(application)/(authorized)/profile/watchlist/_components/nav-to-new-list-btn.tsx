"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

type Props = {};

const NavToNewListBtn = (props: Props) => {
  const router = useRouter();
  return (
    <Button
      onClick={() => router.push("/profile/watchlist/new")}
      variant={"shimmer"}
    >
      Create List
    </Button>
  );
};

export default NavToNewListBtn;
