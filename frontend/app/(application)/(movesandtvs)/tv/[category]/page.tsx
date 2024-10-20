import { lazy, Suspense } from "react";
import { TvPageContentSkelton } from "../../_components/tv-page-content";

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
  const TvPageContent = lazy(() => import("../../_components/tv-page-content"));
  return (
    <Suspense fallback={<TvPageContentSkelton />}>
      <TvPageContent searchParams={searchParams} category={params.category} />
    </Suspense>
  );
};

export default Page;
