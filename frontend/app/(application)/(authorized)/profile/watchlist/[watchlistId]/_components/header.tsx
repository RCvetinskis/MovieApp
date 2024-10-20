import { Button } from "@/components/ui/button";
import { cn, convertUTCToLocalTime } from "@/lib/utils";
import { IWatchListResponse } from "@/types";
import Link from "next/link";

type Props = {
  watchlist: IWatchListResponse;
};

const Header = ({ watchlist }: Props) => {
  const createdAt = convertUTCToLocalTime(
    watchlist.createdAt
  ).toLocaleDateString();
  return (
    <header className="flex justify-between items-center">
      <div className="space-y-2 ">
        <h1 className="text-xl md:text-2xl font-semibold capitalize">
          {watchlist.name}
        </h1>
        <div className="text-sm  dark:text-gray-300 text-primary">
          <p>
            List Created at (<span>{createdAt}</span>)
          </p>
          <p>
            Is Public?{" "}
            <span
              className={cn(
                watchlist.public ? "text-green-500" : "text-red-500"
              )}
            >
              {watchlist.public ? "Yes" : "No"}
            </span>
          </p>
          <p className="italic">
            {watchlist.description && watchlist.description.length > 0
              ? watchlist.description
              : "No description provided."}
          </p>
        </div>
      </div>

      <Link href={`/profile/watchlist/${watchlist.id}/edit`}>
        <Button variant={"shimmer"}>Edit Watchlist</Button>
      </Link>
    </header>
  );
};

export default Header;
