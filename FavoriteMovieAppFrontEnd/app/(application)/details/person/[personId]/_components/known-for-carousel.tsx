import { getKnownForMedia } from "@/actions/tmdb api/getRequests";
import { CarouselContainerSkeleton } from "@/components/carousel-container";
import { Button } from "@/components/ui/button";
import { IMediaType } from "@/types";
import Link from "next/link";
import { lazy, Suspense } from "react";

type Props = {
  personId: string;
  type: IMediaType;
};

const KnownForCarousel = async ({ personId, type }: Props) => {
  const CarouselContainer = lazy(
    () => import("@/components/carousel-container")
  );

  const media = await getKnownForMedia(type, personId);
  if (!media || media.results.length <= 0) return null;

  return (
    <div className="w-full">
      <header className="flex items-center justify-between p-2">
        <h2 className="font-semibold text-lg md:text-2xl">Known For</h2>
        <Link href={`/details/person/${personId}/knownFor`}>
          <Button
            variant={"link"}
            className="text-muted-foreground  text-lg md:text-2xl"
          >
            More...
          </Button>
        </Link>
      </header>

      <Suspense fallback={<CarouselContainerSkeleton />}>
        <CarouselContainer results={media.results} />
      </Suspense>
    </div>
  );
};

export default KnownForCarousel;
