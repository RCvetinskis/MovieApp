import { getMediaCast } from "@/actions/tmdb api/getRequests";
import { CarouselContainerSkeleton } from "@/components/carousel-container";
import { Button } from "@/components/ui/button";
import { limit } from "@/lib/constants";
import { IMediaType } from "@/types";
import Link from "next/link";
import { lazy, Suspense } from "react";

type Props = {
  id: string;
  type: IMediaType;
};

const CastCarousel = async ({ id, type }: Props) => {
  const CarouselContainer = lazy(
    () => import("@/components/carousel-container")
  );
  const cast = await getMediaCast(id.toString(), type, 1, limit);

  if (!cast?.results.length) return null;

  return (
    <div className="space-y-4">
      <header className="flex items-center justify-between">
        <h2 className="font-semibold text-lg md:text-2xl">Cast</h2>
        <Link href={`/details/${type}/${id}/cast`}>
          <Button
            variant={"link"}
            className="text-muted-foreground  md:text-lg"
          >
            Full Cast & Crew
          </Button>
        </Link>
      </header>

      <Suspense fallback={<CarouselContainerSkeleton />}>
        <CarouselContainer results={cast.results} />
      </Suspense>
    </div>
  );
};

export default CastCarousel;
