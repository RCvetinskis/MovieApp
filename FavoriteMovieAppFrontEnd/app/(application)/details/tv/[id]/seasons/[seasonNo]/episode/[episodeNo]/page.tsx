import { getTvShowEpisodeDataById } from "@/actions/tmdb api/getRequests";
import CastCarousel from "@/app/(application)/details/_components/castAndCrew/cast-carousel";
import RatingComponent from "@/components/rating-component";
import { IEpisode } from "@/types";

type Props = {
  params: {
    seasonNo?: string;
    episodeNo?: string;
    id?: string;
  };
};

const EpisodePage = async ({ params }: Props) => {
  const { episodeNo, seasonNo, id } = params;

  if (!seasonNo || !id || !episodeNo) return <div>Params not found</div>;

  const episode: IEpisode = await getTvShowEpisodeDataById(
    id,
    seasonNo,
    episodeNo
  );

  return (
    <div className="space-y-2 ">
      <section>
        <div className="flex items-center gap-3">
          <h1 className="text-lg md:text-2xl">{episode.name}</h1>
          <RatingComponent rating={episode.vote_average} />
        </div>

        <p className="text-sm text-muted-foreground">
          {episode.air_date
            ? `Premiered on ${new Date(episode.air_date).toDateString()}`
            : "TBA"}
        </p>
        <p className="text-muted-foreground text-sm">
          {episode.runtime} minutes
        </p>

        <p>{episode.overview}</p>
      </section>
    </div>
  );
};

export default EpisodePage;
