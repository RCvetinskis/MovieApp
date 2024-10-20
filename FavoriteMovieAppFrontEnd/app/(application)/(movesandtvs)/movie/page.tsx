import { lazy, Suspense } from "react";
import { MoviePageContentSkeleton } from "../_components/movie-page-content";

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
    sort_by?: string;
  };
};
const MoviesPage = async ({ searchParams }: Props) => {
  const MoviePageContent = lazy(
    () => import("../_components/movie-page-content")
  );
  return (
    <Suspense fallback={<MoviePageContentSkeleton />}>
      <MoviePageContent searchParams={searchParams} category="popular" />
    </Suspense>
  );
};

export default MoviesPage;
