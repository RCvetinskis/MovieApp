import GenreItem, { GenreItemSkeleton } from "./genre-item";
import { Genre } from "@/types";
import TitleSkeleton from "@/components/skeletons/title-skeleton";
type Props = {
  data: Genre[] | [];
};
const GenresContainer = ({ data }: Props) => {
  return (
    <div>
      <h2 className="my-2 font-semibold">Genres</h2>
      {data.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {data.map((item) => (
            <GenreItem key={item.id} genre={item} />
          ))}
        </div>
      ) : (
        <p>Genres not found</p>
      )}
    </div>
  );
};

export default GenresContainer;

export const GenresContainerSkeleton = () => {
  return (
    <div className="p-2">
      <div className="my-2">
        <TitleSkeleton />
      </div>

      <div className="flex flex-wrap gap-2">
        {[...Array(12)].map((_, i) => (
          <GenreItemSkeleton key={i} />
        ))}
      </div>
    </div>
  );
};
