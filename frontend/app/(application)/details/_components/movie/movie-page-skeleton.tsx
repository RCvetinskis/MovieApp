import { RatingComponentSkeleton } from "@/components/rating-component";
import { Skeleton } from "@/components/ui/skeleton";
import { ActionsContainerSkeleton } from "../actions-container";
import { CarouselContainerSkeleton } from "@/components/carousel-container";
import { CommentsContainerSkeleton } from "../comments/comments-container";

const MoviePageSkeleton = () => {
  return (
    <div className="space-y-8">
      <div className="w-full min-h-[50svh] rounded-xl relative">
        <div className="relative flex flex-col md:flex-row justify-center items-center gap-6 md:gap-10 p-10">
          {/* image skeleton */}
          <div className="w-full max-w-[350px] sm:max-w-[400px]  mx-auto">
            <div className="bg-gray-500 rounded-lg w-full h-[400px] sm:h-[450px]">
              <Skeleton className="bg-gray-300 w-full h-full rounded-lg" />
            </div>
          </div>

          {/* movie details skeleton */}

          <div className="space-y-6">
            {/* title */}
            <div className="space-y-1">
              <Skeleton className="w-full h-10 bg-gray-500" />
              <Skeleton className="w-1/2 h-10 bg-gray-500" />
            </div>

            {/* Movie Metadata (Rating, Genres, Runtime, etc.) */}
            <div className="flex flex-wrap items-center  gap-4 ">
              <RatingComponentSkeleton />

              <div className="flex flex-wrap gap-2">
                {[...Array(3)].map((_, i) => (
                  <Skeleton key={i} className="w-12 h-6 bg-gray-500" />
                ))}
              </div>
              <Skeleton className="w-12 h-6 bg-gray-500" />
              <Skeleton className="w-12 h-6 bg-gray-500" />

              <ActionsContainerSkeleton />

              {/* keywords */}
              <div className="flex flex-wrap gap-3">
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} className="w-12 h-6 bg-gray-500" />
                ))}
              </div>

              {/* overview */}
              <div className="space-y-2">
                <Skeleton className="w-full h-6 bg-gray-500" />
                <Skeleton className="w-full h-6 bg-gray-500" />
                <Skeleton className="w-full h-6 bg-gray-500" />
              </div>

              <div className="flex items-center gap-1">
                <Skeleton className="w-1/6 h-4 bg-gray-500" />
                <Skeleton className="w-1/4 h-4 bg-gray-300" />
              </div>
              <div className="flex items-center gap-1">
                <Skeleton className="w-1/6 h-4 bg-gray-500" />
                <Skeleton className="w-1/4 h-4 bg-gray-300" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <main className="space-y-4 p-4">
        <CarouselContainerSkeleton />
        <CarouselContainerSkeleton />
        <CommentsContainerSkeleton />
      </main>
    </div>
  );
};

export default MoviePageSkeleton;
