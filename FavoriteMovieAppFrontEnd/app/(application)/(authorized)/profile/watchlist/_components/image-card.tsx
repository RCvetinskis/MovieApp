import { tmdbImageUrl } from "@/lib/constants";
import { Check } from "lucide-react";
import Image from "next/image";

type Props = {
  item: any;
  selected: string;
  onSelect: (image: string) => void;
};

const ImageCard = ({ item, selected, onSelect }: Props) => {
  const image = item.poster_path
    ? `${tmdbImageUrl}/${item.poster_path}`
    : "/assets/no_image.jpg";

  const handleClick = () => {
    onSelect(image);
  };

  const isSelected = selected === image;

  return (
    <div
      onClick={handleClick}
      className="w-[250px] h-[250px] rounded-xl shadow-none border-none p-0 relative group hover:cursor-pointer"
    >
      <Image
        src={image}
        alt={"TMDB_IMAGE"}
        width={250}
        height={250}
        loading="lazy"
        className="aspect-square object-cover rounded-xl"
      />
      {isSelected ? (
        <div className="absolute inset-0 bg-black/70  flex items-center justify-center  transition-opacity duration-300 rounded-lg">
          <span className="bg-secondary w-full   p-2 flex items-center justify-center gap-1  ">
            Selected
            <Check size={18} />
          </span>
        </div>
      ) : (
        <div className="absolute inset-0 bg-black/70  flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg">
          <span className="bg-secondary w-full text-center p-2  ">
            Select Image
          </span>
        </div>
      )}
    </div>
  );
};

export default ImageCard;
