"use client";
import { useRouter } from "next/navigation";
import ButtonTitleIcon from "../buttons/button-icon-title";
import { Heart, List } from "lucide-react";
import TitleSkeleton from "../skeletons/title-skeleton";
import BtnSkeleton from "../skeletons/btn-skeleton";

type Props = {};

const LinksLists = (props: Props) => {
  const router = useRouter();
  return (
    <div>
      <h2 className="font-semibold">Lists</h2>
      <div className="flex flex-col">
        <ButtonTitleIcon
          title="Watchlist"
          handleClick={() => router.push("/profile/watchlist")}
        >
          <List />
        </ButtonTitleIcon>

        <ButtonTitleIcon
          title="Favorites"
          handleClick={() => router.push("/profile/favorites")}
        >
          <Heart />
        </ButtonTitleIcon>
      </div>
    </div>
  );
};

export default LinksLists;

export const LinksListSkeleton = () => {
  return (
    <div className="space-y-2">
      <TitleSkeleton />

      <div className="flex flex-col gap-3">
        {[...Array(4)].map((_, i) => (
          <BtnSkeleton key={i} />
        ))}
      </div>
    </div>
  );
};
