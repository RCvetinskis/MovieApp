"use client";
import { Card, CardContent, CardFooter, CardTitle } from "@/components/ui/card";
import { tmdbImageUrl } from "@/lib/constants";
import Image from "next/image";
import RatingComponent from "../rating-component";
import { Skeleton } from "../ui/skeleton";
import Link from "next/link";
import HoverContent from "../authenticated/cardActions/hover-content";
import { Button } from "../ui/button";
import { RectangleEllipsis } from "lucide-react";
import { IMediaType } from "@/types";
import useAirDates from "@/hooks/useAirDates";
type Props = {
  item: any;
};

const MainCard = ({ item }: Props) => {
  const type: IMediaType = item.title ? "movie" : "tv";
  const { airDates, isLoading } = useAirDates(
    type === "tv" ? item.id.toString() : ""
  );

  if (isLoading) return <MainCardSkeleton />;

  const image = item.poster_path
    ? `${tmdbImageUrl}/${item.poster_path}`
    : item.profile_path
    ? `${tmdbImageUrl}/${item.profile_path}`
    : "/assets/no_image.jpg";

  const title = item.name ? item.name : item.title;

  const mediaType = item.title
    ? "movie"
    : item.known_for_department
    ? "person"
    : "tv";

  const mediaItem = {
    tmdbId: item.id.toString(),
    type,
    title,
    lastEpisodeDate: airDates?.lastEpisodeDate,
    nextEpisodeDate: airDates?.nextEpisodeDate,
  };

  return (
    <Card>
      <CardContent className="px-0 relative">
        <Link href={`/details/${mediaType}/${item.id}`}>
          <div className="h-[310px] ">
            <Image
              src={image}
              alt="TMDB poster"
              width={300}
              height={500}
              className="rounded-lg w-full aspect-square h-full   object-cover "
            />
          </div>
        </Link>
        {item.vote_average > 0 && (
          <div className="absolute bottom-0 right-0">
            <RatingComponent rating={item.vote_average} />
          </div>
        )}
      </CardContent>
      <CardFooter className="w-full h-14 flex justify-between items-center ">
        <CardTitle className=" line-cramp-2 ">{title}</CardTitle>
        {mediaType !== "person" && (
          <HoverContent mediaItem={mediaItem}>
            <Button className="cursor-default" size={"sm"} variant={"ghost"}>
              <RectangleEllipsis />
            </Button>
          </HoverContent>
        )}
      </CardFooter>
    </Card>
  );
};

export default MainCard;

export const MainCardSkeleton = () => {
  return <Skeleton className="rounded-xl  h-[400px] bg-gray-500" />;
};
