import Image from "next/image";
import Header from "../../_components/header";
import { Badge } from "@/components/ui/badge";
import RatingComponent from "@/components/rating-component";
import ProductionCountries from "../../_components/production-countries";
import ActionsContainer from "../../_components/actions-container";
import KeyWordsContainer from "../../_components/keywords-container";
import ProductionCompanies from "../../_components/production-companies";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getMediaById } from "@/actions/tmdb api/getRequests";
import { tmdbImageUrl } from "@/lib/constants";
import { Genre } from "@/types";
import Navigation from "../../_components/tv/navigation";

type Props = {
  children: React.ReactNode;
  params: {
    id: string;
  };
};

const TvDetailsLayout = async ({ children, params }: Props) => {
  const id = params.id;
  if (!id) return <div>Page not found</div>;
  const tvShow = await getMediaById(id, "tv");

  const image = tvShow.poster_path
    ? `${tmdbImageUrl}/${tvShow.poster_path}`
    : "/assets/no_image.jpg";

  return (
    <div className="space-y-4">
      <Header backdropPath={tvShow.backdrop_path}>
        <div className="relative flex flex-col md:flex-row justify-center items-center gap-6 md:gap-10 p-10">
          {/* tvShow Poster */}
          <Image
            src={image}
            alt="tvShow Poster"
            width={300}
            height={300}
            className="rounded-lg shadow-lg w-full max-w-[300px] mx-auto md:mx-0"
          />

          {/* tvShow Details */}
          <div className="text-white space-y-2 ">
            {/* tvShow Title */}
            <h1 className="text-xl md:text-3xl font-bold">
              {tvShow.name}
              <span className="text-muted-foreground">
                ({tvShow.first_air_date})
              </span>
            </h1>
            {/* seasons and episodes total */}
            <div className="flex items-center gap-3">
              <Badge className="space-x-1" variant={"secondary"}>
                <span>Seasons</span>
                <span>{tvShow.number_of_seasons}</span>
              </Badge>

              <Badge className="space-x-1" variant={"secondary"}>
                <span>Episodes</span>
                <span>{tvShow.number_of_episodes}</span>
              </Badge>
            </div>

            {/* tvShow Metadata (Rating, Genres, etc.) */}
            <div className="flex flex-wrap items-center  gap-4 ">
              <RatingComponent rating={tvShow.vote_average} />
              <div className="flex flex-wrap gap-2">
                {tvShow.genres.map((genre: Genre) => (
                  <Badge variant={"secondary"} key={genre.id}>
                    {genre.name}
                  </Badge>
                ))}
              </div>

              <ProductionCountries countries={tvShow.production_countries} />
            </div>

            <ActionsContainer
              tmdbId={tvShow.id.toString()}
              type="tv"
              title={tvShow.title}
            />

            <KeyWordsContainer id={tvShow.id.toString()} type="tv" />

            <ProductionCompanies
              productionCompanies={tvShow.production_companies}
            />

            <p className="text-muted-foreground">{tvShow.overview}</p>

            {tvShow.homepage && (
              <Link className="w-fit" target="_blank" href={tvShow.homepage}>
                <Button
                  className="px-0 text-muted-foreground line-clamp-1 "
                  variant={"link"}
                >
                  {new URL(tvShow.homepage).hostname}{" "}
                </Button>
              </Link>
            )}
          </div>
        </div>
      </Header>

      <Navigation id={id} seasonsLength={tvShow.seasons.length} />
      <main className="px-4">{children}</main>
    </div>
  );
};

export default TvDetailsLayout;
