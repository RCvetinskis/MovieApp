import ListNavigation from "../../_components/list-navigation";
import { redirect } from "next/navigation";
import { getWatchListById } from "@/actions/backend/watchlist-serverside";
import EditWatchlistContainer from "./_components/edit-watchlist-container";
import { getMediaitemsByWatchListId } from "@/actions/backend/mediaitems-serverside";

type Props = {
  params: {
    watchlistId?: string;
  };
  searchParams: {
    navStep?: string;
  };
};

const EditWatchlistPage = async ({ params, searchParams }: Props) => {
  const { watchlistId } = params;
  if (!watchlistId) redirect("/profile/watchlist");
  const watchlist = await getWatchListById(watchlistId);
  if (!watchlist) redirect("/profile/watchlist");
  const mediaItems = await getMediaitemsByWatchListId(watchlistId);

  const { navStep } = searchParams;
  return (
    <div>
      <div className="space-y-6">
        <header className="space-y-4">
          <h1>Edit list</h1>

          <ListNavigation isEdit={true} />
        </header>
        <EditWatchlistContainer
          defaultWatchlist={watchlist}
          defaultMediaItems={mediaItems.response?.mediaItems}
          navStep={navStep}
        />
      </div>
    </div>
  );
};

export default EditWatchlistPage;
