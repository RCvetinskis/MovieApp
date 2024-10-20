import { getMediaById } from "@/actions/tmdb api/getRequests";
import SeasonsContainer from "./_components/seasons-container";

type Props = {
  params: {
    id: string;
  };
};

const SeasonPage = async ({ params }: Props) => {
  const id = params.id;

  const tvShow = await getMediaById(id, "tv");

  return (
    <div>
      <SeasonsContainer seasons={tvShow.seasons} />
    </div>
  );
};

export default SeasonPage;
