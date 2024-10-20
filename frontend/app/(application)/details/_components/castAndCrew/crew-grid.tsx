import { getMediaCrew } from "@/actions/tmdb api/getRequests";
import CrewCard from "@/components/cards/crew-card";
import PaginationContainer from "@/components/pagination/pagination-container";
import { limit } from "@/lib/constants";
import { IMediaType } from "@/types";

type Props = {
  id: string;
  type: IMediaType;
  page: number;
};

const CrewGrid = async ({ id, type, page }: Props) => {
  const crew = await getMediaCrew(id, type, page, limit);

  if (!crew || crew.results.length === 0)
    return <div className="text-lg">Results not found</div>;

  const totalPages = Math.min(crew.totalPages, 500);
  return (
    <div>
      <header className="p-2">
        <h1 className="text-lg lg:text-2xl">Crew</h1>
      </header>
      <div className="grid grid-cols-1 lg:grid-cols-2">
        {crew.results.map((item, i) => (
          <CrewCard key={i} item={item} />
        ))}
      </div>

      <footer className="py-6">
        <PaginationContainer totalPages={totalPages} />
      </footer>
    </div>
  );
};

export default CrewGrid;
