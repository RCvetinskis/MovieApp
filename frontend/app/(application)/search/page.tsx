import { getSearchResults } from "@/actions/tmdb api/getRequests";
import { MovieApiResponse } from "@/types";

import { SwitchCategorySkeleton } from "./_components/switch-category";
import { PaginationContainerSkeleton } from "@/components/pagination/pagination-container";
import { lazy, Suspense } from "react";
import { CardsContainerSkeleton } from "@/components/cards/cards-container";

type Props = {
  searchParams: {
    q: string;
    category: string;
    page?: string;
  };
};

const SearchPage = async ({ searchParams }: Props) => {
  const { q, category = "multi", page = "1" } = searchParams;

  const data: MovieApiResponse = await getSearchResults(q, category, page);
  const totalPages = Math.min(data.total_pages, 500);
  const SwtichCategory = lazy(() => import("./_components/switch-category"));
  const PaginationContainer = lazy(
    () => import("@/components/pagination/pagination-container")
  );
  const SearchResults = lazy(() => import("./_components/search-results"));

  return (
    <div className="w-full space-y-6">
      <h1 className="text-xl md:text-3xl text-semibold">Search "{q}" </h1>
      <header>
        <Suspense fallback={<SwitchCategorySkeleton />}>
          <SwtichCategory />
        </Suspense>
      </header>
      <main>
        {data?.results?.length > 0 ? (
          <Suspense fallback={<CardsContainerSkeleton />}>
            <SearchResults results={data.results} />
          </Suspense>
        ) : (
          <p>No results found.</p>
        )}
      </main>

      <footer className="py-6">
        <Suspense fallback={<PaginationContainerSkeleton />}>
          <PaginationContainer totalPages={totalPages} />
        </Suspense>
      </footer>
    </div>
  );
};

export default SearchPage;
