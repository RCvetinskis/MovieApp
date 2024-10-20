import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { tmdbImageUrl } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { useWatchListStore } from "@/store/store-watchlist";

import Image from "next/image";

type Props = {
  item: any;
  handleClose: () => void;
};

const SearchCard = ({ item, handleClose }: Props) => {
  const image = item.poster_path
    ? `${tmdbImageUrl}/${item.poster_path}`
    : "/assets/no_image.jpg";

  const { addMediaItem } = useWatchListStore();

  const handleAddItem = () => {
    if (!item) return;

    addMediaItem(item);
    handleClose();
  };

  const title = item.title ? item.title : item.name;
  const releaseDate = item.release_date
    ? item.release_date
    : item.first_air_date;

  return (
    <Card
      onClick={handleAddItem}
      className="hover:bg-primary-foreground/50 cursor-pointer "
    >
      <div className="flex items-center  gap-2">
        <Image
          src={image}
          alt={"TMDB_IMAGE"}
          width={100}
          height={100}
          loading="lazy"
          className="aspect-square object-contain rounded-lg"
        />

        <CardContent className="p-2">
          <CardTitle>{title}</CardTitle>
          <div className="text-sm">
            <p
              className={cn(
                item.media_type === "movie"
                  ? "text-slate-500"
                  : "text-green-600",
                "capitalize"
              )}
            >
              {item.media_type}
            </p>
            {releaseDate && <p> {releaseDate}</p>}
          </div>
        </CardContent>
      </div>
    </Card>
  );
};

export default SearchCard;
