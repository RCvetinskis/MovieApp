import { IWatchListResponse } from "@/types";
import WatchListCard from "./watchlist-card";

type Props = {
  watchlists: IWatchListResponse[];
};

const MyLists = async ({ watchlists }: Props) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5  ">
      {watchlists.map((list) => (
        <WatchListCard key={list.id} watchlist={list} />
      ))}
    </div>
  );
};

export default MyLists;
