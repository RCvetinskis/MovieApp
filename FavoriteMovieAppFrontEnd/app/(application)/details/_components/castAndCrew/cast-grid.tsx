import { getMediaCast } from "@/actions/tmdb api/getRequests";
import CastCard from "@/components/cards/cast-card";
import PaginationContainer from "@/components/pagination/pagination-container";
import { limit } from "@/lib/constants";
import { IMediaType } from "@/types";

type Props = {
  id: string;
  type: IMediaType;
  page: number;
};

const CastGrid = async ({ id, type, page }: Props) => {
  const cast = await getMediaCast(id, type, page, limit);
  if (!cast || cast.results.length <= 0)
    return <div className="text-lg">Results not found</div>;

  const totalPages = Math.min(cast.totalPages, 500);
  return (
    <div>
      <header className="p-2">
        <h1 className="text-lg lg:text-2xl">Cast</h1>
      </header>
      <div className="grid grid-cols-1 lg:grid-cols-2">
        {cast.results.map((item, i) => (
          <CastCard key={i} item={item} />
        ))}
      </div>

      <footer className="py-6">
        <PaginationContainer totalPages={totalPages} />
      </footer>
    </div>
  );
};

export default CastGrid;
