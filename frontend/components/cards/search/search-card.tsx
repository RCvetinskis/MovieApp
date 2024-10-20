import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardTitle,
} from "@/components/ui/card";
import { tmdbImageUrl } from "@/lib/constants";
import Image from "next/image";
import Link from "next/link";

type Props = {
  title: string;
  tmdbId: string | number;
  type: string;
  releaseDate?: string;
  overview?: string;
  posterPath: string;
};

const SearchCard = ({
  title,
  tmdbId,
  releaseDate,
  overview,
  posterPath,
  type,
}: Props) => {
  const image = posterPath
    ? `${tmdbImageUrl}/${posterPath}`
    : "/assets/no_image.jpg";
  return (
    <Link href={`/details/${type}/${tmdbId}`}>
      <Card className="hover:bg-primary-foreground/50 cursor-pointer">
        <div className="flex items-center  gap-2">
          <Image
            src={image}
            alt={"TMDB_IMAGE"}
            width={140}
            height={140}
            loading="lazy"
            className="aspect-square object-contain rounded-lg"
          />

          <CardContent className="p-2">
            <CardTitle>{title}</CardTitle>

            <CardDescription className="line-clamp-5">
              {overview}
            </CardDescription>
          </CardContent>
        </div>
        {releaseDate && (
          <CardFooter className="text-card-foreground text-sm p-0 px-8">
            {releaseDate}
          </CardFooter>
        )}
      </Card>
    </Link>
  );
};

export default SearchCard;

export const SearchCardSkeleton = () => {
  return (
    <div className="rounded-xl border bg-gray-500 w-full h-[190px] shadow"></div>
  );
};
