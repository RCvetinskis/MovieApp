"use client";
import { Genre } from "@/types";
import { Button } from "@/components/ui/button";
import { useSearchFilterStore } from "@/store/store-filter-search";
import { Skeleton } from "@/components/ui/skeleton";

type Props = {
  genre: Genre;
  className?: string;
};

const GenreItem = ({ genre, className }: Props) => {
  const { genres, setGenre } = useSearchFilterStore();
  const handleClick = () => {
    setGenre(genre);
  };

  const isSelected = genres.some((item) => item.id === genre.id);

  return (
    <div className="relative">
      <Button
        onClick={handleClick}
        variant={isSelected ? "shimmer" : "secondary"}
        size={"sm"}
      >
        {genre.name}
      </Button>
    </div>
  );
};

export default GenreItem;

export const GenreItemSkeleton = () => {
  return <Skeleton className="w-24 h-8 rounded-md" />;
};
