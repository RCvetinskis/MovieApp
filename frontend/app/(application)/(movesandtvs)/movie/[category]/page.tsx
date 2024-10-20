import { Suspense, lazy } from "react";
import { MoviePageContentSkeleton } from "../../_components/movie-page-content";

type Props = {
  searchParams: {
    page: string;
    with_original_language: string;
    vote_average_gte: string;
    vote_average_lte: string;
    with_genres: string;
    with_keywords?: string;
    release_date_gte?: string;
    release_date_lte?: string;
    sort_by: string;
  };
  params: { category: string };
};

const Page = ({ searchParams, params }: Props) => {
  const MoviePageContent = lazy(
    () => import("../../_components/movie-page-content")
  );
  return (
    <Suspense fallback={<MoviePageContentSkeleton />}>
      <MoviePageContent
        searchParams={searchParams}
        category={params.category}
      />
    </Suspense>
  );
};

export default Page;
