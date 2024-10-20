import { getDiscover, getTvLists } from "@/actions/tmdb api/getRequests";
import CardsContainer, {
  CardsContainerSkeleton,
} from "../../../../components/cards/cards-container";
import PaginationContainer, {
  PaginationContainerSkeleton,
} from "@/components/pagination/pagination-container";
import TitleSkeleton from "@/components/skeletons/title-skeleton";

type Props = {
  searchParams: {
    page: string;
    sort_by?: string;
    with_original_language?: string;
    vote_average_gte?: string;
    vote_average_lte?: string;
    with_genres: string;
    with_keywords?: string;
    release_date_gte?: string;
    release_date_lte?: string;
  };
  category: string;
};

const TvPageContent = async ({ searchParams, category }: Props) => {
  const {
    page = "1",
    sort_by,
    with_original_language,
    vote_average_gte,
    vote_average_lte,
    with_genres,
    with_keywords,
    release_date_gte,
    release_date_lte,
  } = searchParams;

  const tvLists = await getTvLists(category, page);

  // Check if there are any defined parameters
  const hasParams =
    sort_by ||
    with_original_language ||
    vote_average_gte ||
    vote_average_lte ||
    with_genres ||
    with_keywords ||
    release_date_gte ||
    release_date_lte;

  // Call getDiscover only if there are defined parameters
  const discoverTv = hasParams
    ? await getDiscover(
        "tv",
        page,
        sort_by || "",
        with_original_language || "",
        vote_average_gte || "",
        vote_average_lte || "",
        with_genres,
        with_keywords || "",
        release_date_gte || "",
        release_date_lte || ""
      )
    : { results: [], total_results: 0, total_pages: 0 };

  const noResultsInDiscover = hasParams && discoverTv.total_results === 0;

  const noResultsInTvLists = !hasParams && tvLists.total_results === 0;
  const noResults = noResultsInDiscover || noResultsInTvLists;

  const data = discoverTv.total_results > 0 ? discoverTv : tvLists;

  const title =
    discoverTv.total_results > 0
      ? "Discover TV Shows"
      : category === "top_rated"
      ? "Top Rated TV Shows"
      : category === "airing_today"
      ? "Airing Today"
      : category === "on_the_air"
      ? "On The Air"
      : "Popular TV Shows";

  const totalPages = Math.min(data.total_pages, 500);

  return (
    <>
      {noResults ? (
        <p className="text-center text-lg">Results not found.</p>
      ) : (
        <div>
          <h1 className="text-xl md:text-3xl font-semibold mb-4">{title}</h1>

          <main>
            <CardsContainer results={data.results} />
          </main>

          <footer className="py-6">
            <PaginationContainer totalPages={totalPages} />
          </footer>
        </div>
      )}
    </>
  );
};

export default TvPageContent;
export const TvPageContentSkelton = () => {
  return (
    <div>
      <div className="mb-4">
        <TitleSkeleton />
      </div>

      <main>
        <CardsContainerSkeleton />
      </main>

      <footer className="py-6">
        <PaginationContainerSkeleton />
      </footer>
    </div>
  );
};
