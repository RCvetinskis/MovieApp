import { getMediaById } from "@/actions/tmdb api/getRequests";
import { limit, tmdbImageUrl } from "@/lib/constants";
import { IMediaType, Movie } from "@/types";
import Header from "../../_components/header";
import Image from "next/image";
import RatingComponent from "@/components/rating-component";
import { minutesToHours, usDollar } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import ProductionCompanies from "../../_components/production-companies";
import ProductionCountries from "../../_components/production-countries";
import ActionsContainer from "../../_components/actions-container";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import CastCarousel from "../../_components/castAndCrew/cast-carousel";
import KeyWordsContainer from "../../_components/keywords-container";
import RecommendationsContainer from "../../_components/recommendations-container";
import CommentsContainer from "../../_components/comments/comments-container";
import { getCommentsByPostId } from "@/actions/backend/comment-server";
import MoviePageSkeleton from "../../_components/movie/movie-page-skeleton";
import { Suspense } from "react";

type Props = {
  params: {
    id: string;
  };
};

const MovieDetailsPage = async ({ params }: Props) => {
  const id = params.id;

  if (!id) return <div>Page not found</div>;

  const movie: Movie = await getMediaById(id, "movie");

  const runtime = minutesToHours(movie.runtime);

  const postId = `movie${movie.id}`;
  const comments = await getCommentsByPostId(postId, 1, limit);

  const image = movie.poster_path
    ? `${tmdbImageUrl}/${movie.poster_path}`
    : "/assets/no_image.jpg";

  const mediaItem = {
    tmdbId: movie.id.toString(),
    type: "movie" as IMediaType,
    title: movie.title,
  };

  return (
    <Suspense fallback={<MoviePageSkeleton />}>
      <div className="space-y-8 ">
        <Header backdropPath={movie.backdrop_path}>
          <div className="relative flex flex-col md:flex-row justify-center items-center gap-6 md:gap-10 p-10">
            {/* Movie Poster */}
            <Image
              src={image}
              alt="Movie Poster"
              width={300}
              height={300}
              className="rounded-lg shadow-lg w-full max-w-[300px] mx-auto md:mx-0"
            />

            {/* Movie Details */}
            <div className="text-white space-y-2">
              {/* Movie Title */}
              <h1 className="text-xl md:text-3xl font-bold">
                {movie.title}
                <span className="text-muted-foreground">
                  ({movie.release_date})
                </span>
              </h1>

              {/* Movie Metadata (Rating, Genres, Runtime, etc.) */}
              <div className="flex flex-wrap items-center  gap-4 ">
                <RatingComponent rating={movie.vote_average} />
                <div className="flex flex-wrap gap-2">
                  {movie.genres.map((genre) => (
                    <Badge variant={"secondary"} key={genre.id}>
                      {genre.name}
                    </Badge>
                  ))}
                </div>
                <Badge variant={"secondary"}>{runtime}</Badge>
                <ProductionCountries countries={movie.production_countries} />
              </div>

              <ActionsContainer mediaItem={mediaItem} />

              <KeyWordsContainer id={movie.id.toString()} type="movie" />

              <ProductionCompanies
                productionCompanies={movie.production_companies}
              />

              <p className="text-muted-foreground">{movie.overview}</p>

              {/* budged & revanue */}
              <div className="text-sm text-muted-foreground">
                {movie.budget > 0 && (
                  <p>
                    Budget{" "}
                    <span className="text-primary">
                      {usDollar(movie.budget)}
                    </span>
                  </p>
                )}

                {movie.revenue > 0 && (
                  <p>
                    Revenue{" "}
                    <span className="text-primary">
                      {usDollar(movie.revenue)}
                    </span>
                  </p>
                )}
              </div>

              {movie.homepage && (
                <Link className="w-fit" target="_blank" href={movie.homepage}>
                  <Button
                    className="px-0 text-muted-foreground line-clamp-1 "
                    variant={"link"}
                  >
                    {new URL(movie.homepage).hostname}{" "}
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </Header>

        <main className="space-y-4 p-4">
          <CastCarousel id={movie.id.toString()} type="movie" />

          <RecommendationsContainer id={movie.id.toString()} type="movie" />

          <CommentsContainer comments={comments} postId={postId} />
        </main>
      </div>
    </Suspense>
  );
};

export default MovieDetailsPage;
