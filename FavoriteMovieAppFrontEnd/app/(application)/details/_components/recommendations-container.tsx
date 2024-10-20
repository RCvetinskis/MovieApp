import { getMediaRecommendations } from "@/actions/tmdb api/getRequests";
import { CarouselContainerSkeleton } from "@/components/carousel-container";
import { IMediaType, Movie } from "@/types";
import { lazy, Suspense } from "react";

type Props = {
  id: string;
  type: IMediaType;
};

const RecommendationsContainer = async ({ id, type }: Props) => {
  const CarouselContainer = lazy(
    () => import("@/components/carousel-container")
  );
  const recommendations: Movie[] | undefined = await getMediaRecommendations(
    id,
    type
  );

  if (!recommendations || recommendations.length <= 0) return null;

  return (
    <div className="space-y-4">
      <h2 className="font-semibold text-lg md:text-2xl">Recommendations</h2>
      <Suspense fallback={<CarouselContainerSkeleton />}>
        <CarouselContainer results={recommendations} />
      </Suspense>
    </div>
  );
};

export default RecommendationsContainer;
