import { Suspense, lazy } from "react";
import { getMovieLists, getTrending } from "@/actions/tmdb api/getRequests";
import { CarouselContainerSkeleton } from "@/components/carousel-container";
import { TrendingContainerSkeleton } from "./_components/trending-container";

const HomePage = async () => {
  const TrendingContainer = lazy(
    () => import("./_components/trending-container")
  );
  const CarouselContainer = lazy(
    () => import("@/components/carousel-container")
  );
  const popularMovies = getMovieLists("popular");
  const topRatedMovies = getMovieLists("top_rated");
  const trending = getTrending("day");

  const [popular, topRated, trendingResults] = await Promise.all([
    popularMovies,
    topRatedMovies,
    trending,
  ]);

  return (
    <div className="px-10">
      <main className="space-y-4">
        {/* Trending section */}
        <section>
          <h2 className="text-lg md:text-2xl font-semibold my-4">
            Trending Movies
          </h2>
          <Suspense fallback={<TrendingContainerSkeleton />}>
            <TrendingContainer initialResults={trendingResults.results} />
          </Suspense>
        </section>

        {/* Popular movies */}
        <section>
          <h2 className="text-lg md:text-2xl font-semibold my-4">
            Popular Movies
          </h2>
          <Suspense fallback={<CarouselContainerSkeleton />}>
            <CarouselContainer results={popular.results} />
          </Suspense>
        </section>

        {/* Top-rated movies */}
        <section>
          <h2 className="text-lg md:text-2xl font-semibold my-4">
            Top-Rated Movies
          </h2>
          <Suspense fallback={<CarouselContainerSkeleton />}>
            <CarouselContainer results={topRated.results} />
          </Suspense>
        </section>
      </main>
    </div>
  );
};

export default HomePage;
