"use client";
import RatingComponent from "@/components/rating-component";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { tmdbImageUrl } from "@/lib/constants";
import { ISeason } from "@/types";
import Image from "next/image";
import { useRouter } from "next/navigation";

type Props = {
  item: ISeason;
};

const SeasonCard = ({ item }: Props) => {
  const image = item.poster_path
    ? `${tmdbImageUrl}/${item.poster_path}`
    : "/assets/no_image.jpg";

  const router = useRouter();
  const handleNavigate = () => {
    router.push(`seasons/${item.season_number}`);
  };

  return (
    <Card className="w-full flex items-center p-4 gap-4 shadow-md">
      {/* Poster Image */}
      <CardHeader
        onClick={handleNavigate}
        className="w-1/5 p-0 hover:cursor-pointer"
      >
        <Image
          src={image}
          width={150}
          height={225}
          alt={`Poster for ${item.name}`}
          className="rounded-lg object-cover"
        />
      </CardHeader>

      {/* Season Details */}
      <CardContent className="flex-1 ">
        <CardTitle className="text-xl font-semibold">{item.name}</CardTitle>
        <p className="text-sm text-gray-500">
          {item.air_date
            ? `Premiered on ${new Date(item.air_date).toDateString()}`
            : "TBA"}
        </p>
        <p className="text-sm text-gray-500">{item.episode_count} Episodes</p>

        <p className="mt-2 text-base line-clamp-2 text-gray-700">
          {item.overview}
        </p>
      </CardContent>

      {/* Rating and Button */}
      <CardFooter className="flex flex-col items-center  space-y-2">
        {item.vote_average > 0 && (
          <RatingComponent rating={item.vote_average} />
        )}

        <Button onClick={handleNavigate} variant="outline" size="sm">
          View Details
        </Button>
      </CardFooter>
    </Card>
  );
};

export default SeasonCard;
