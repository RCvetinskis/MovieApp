import { getMediaitemsByWatchListId } from "@/actions/backend/mediaitems-serverside";
import { fetchMoviesByids } from "@/actions/tmdb api/getRequests";
import CardsContainer from "@/components/cards/cards-container";
import PaginationContainer from "@/components/pagination/pagination-container";
import { limit } from "@/lib/constants";

type Props = {
  watchlistId: string;
  searchParams: {
    query?: string;
    sortBy?: string;
    page?: string;
  };
};

const MainContainer = async ({ watchlistId, searchParams }: Props) => {
  const { page, query, sortBy } = searchParams;

  const mediaData = await getMediaitemsByWatchListId(
    watchlistId,
    Number(page ?? 1),
    limit,
    query,
    sortBy
  );

  if (!mediaData || mediaData.response.totalItems === 0) {
    return (
      <p className="text-xl font-semibold text-center">No results found.</p>
    );
  }

  const results = await fetchMoviesByids(mediaData.response.mediaItems);

  if (results.length === 0) {
    return (
      <p className="text-xl font-semibold text-center">No results found.</p>
    );
  }

  return (
    <main>
      <CardsContainer results={results} />

      <footer className="py-6">
        <PaginationContainer totalPages={mediaData.response.totalPages} />
      </footer>
    </main>
  );
};

export default MainContainer;
