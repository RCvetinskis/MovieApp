"use client";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import Image from "next/image";
import { Button } from "../ui/button";
import { Cast } from "@/types";
import { tmdbImageUrl } from "@/lib/constants";
import { useRouter } from "next/navigation";

type Props = {
  item: Cast;
};

const CastCard = ({ item }: Props) => {
  const { push } = useRouter();
  const image = item.profile_path
    ? `${tmdbImageUrl}/${item.profile_path}`
    : "/assets/no_image.jpg";
  return (
    <Card className="w-full flex items-center p-4 gap-4 shadow-md">
      {/* Poster Image */}
      <CardHeader className="w-1/5 p-0 hover:cursor-pointer">
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
        <p className="text-sm text-gray-500">{item.character}</p>
      </CardContent>

      {/* Rating and Button */}
      <CardFooter>
        <Button
          onClick={() => push(`/details/person/${item.id}`)}
          variant="outline"
          size="sm"
        >
          View Details
        </Button>
      </CardFooter>
    </Card>
  );
};

export default CastCard;
