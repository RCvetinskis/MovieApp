import { getTvShowSeasonDataById } from "@/actions/tmdb api/getRequests";
import RatingComponent from "@/components/rating-component";
import EpisodesContainer from "../_components/episodes-container";

type Props = {
  params: {
    seasonNo?: string;
    id?: string;
  };
};

const SeasonPage = async ({ params }: Props) => {
  const { seasonNo, id } = params;

  if (!seasonNo || !id) return <div>Params not found</div>;

  const season = await getTvShowSeasonDataById(id, seasonNo);

  const episodes = season.episodes;
  return (
    <div className="space-y-2">
      <section>
        <div className="flex items-center gap-3">
          <h1 className="text-lg md:text-2xl">{season.name}</h1>
          <RatingComponent rating={season.vote_average} />
        </div>
        <p className="text-sm text-muted-foreground">
          {season.air_date
            ? `Premiered on ${new Date(season.air_date).toDateString()}`
            : "TBA"}
        </p>

        <p>{season.overview}</p>
      </section>

      {episodes.length > 0 ? (
        <EpisodesContainer episodes={episodes} />
      ) : (
        <p>No episodes found</p>
      )}
    </div>
  );
};

export default SeasonPage;
