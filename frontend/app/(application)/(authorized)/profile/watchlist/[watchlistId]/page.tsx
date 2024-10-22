import { getWatchListById } from "@/actions/backend/watchlist-serverside";
import { IWatchListResponse } from "@/types";
import { redirect } from "next/navigation";
import MainContainer from "./_components/main-container";
import SearchFilterContainer from "../../_components/search-filter-container";
import Header from "./_components/header";

type Props = {
  params: {
    watchlistId: string;
  };
  searchParams: {
    query?: string;
    sortBy?: string;
    page?: string;
  };
};

const WatchListIdPage = async ({ params, searchParams }: Props) => {
  const { watchlistId } = params;

  if (!watchlistId) redirect("/profile/watchlist");

  const watchlist = (await getWatchListById(watchlistId)) as IWatchListResponse;
  if (!watchlist) redirect("/profile/watchlist");

  const isImage = watchlist.imageUrl && watchlist.imageUrl.length > 0;

  return (
    <div className="space-y-6 relative z-10">
      {isImage && (
        <div
          className="absolute inset-0 z-0 opacity-20"
          style={{
            backgroundImage: `url(${watchlist.imageUrl})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            filter: "blur(10px)",
            zIndex: "-1",
          }}
        />
      )}
      <Header watchlist={watchlist} />

      <section>
        <SearchFilterContainer />
      </section>

      <MainContainer watchlistId={watchlistId} searchParams={searchParams} />
    </div>
  );
};

export default WatchListIdPage;
