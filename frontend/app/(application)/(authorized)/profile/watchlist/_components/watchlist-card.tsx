import { IWatchListResponse } from "@/types";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

type Props = {
  watchlist: IWatchListResponse;
};

const WatchListCard = ({ watchlist }: Props) => {
  const image =
    watchlist.imageUrl && watchlist.imageUrl.length > 0
      ? watchlist.imageUrl
      : "/assets/cinema.jpg";

  return (
    <Link
      href={`/profile/watchlist/${watchlist.id}`}
      className="max-w-xs w-full group/card shadow-md shadow-card-foreground rounded-lg"
    >
      <div
        className={cn(
          "cursor-pointer overflow-hidden relative card h-96 rounded-md shadow-xl max-w-sm mx-auto flex flex-col justify-between p-4"
        )}
        style={{
          backgroundImage: `url(${image})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute w-full h-full top-0 left-0 transition duration-300 bg-black/70  group-hover/card:bg-black/40"></div>

        <div className="z-10">
          <h1 className="font-bold text-xl md:text-2xl relative ">
            {watchlist.name}
          </h1>
          <div className="flex items-center text-gray-300 gap-2 flex-wrap">
            <p>{watchlist.mediaItemsTotal} Items</p>

            <Badge variant={"secondary"}>
              {watchlist.public ? "Public" : "Private"}
            </Badge>
          </div>
          <p className="font-normal text-sm  relative z-10 my-4">
            {watchlist.description && watchlist.description.length > 0
              ? watchlist.description
              : "No description provided."}
          </p>
        </div>
      </div>
    </Link>
  );
};

export default WatchListCard;
