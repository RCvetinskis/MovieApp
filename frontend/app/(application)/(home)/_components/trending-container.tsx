"use client";
import CarouselContainer, {
  CarouselContainerSkeleton,
} from "@/components/carousel-container";
import ToggleDate, { ToggleDateSkeleton } from "./toggle-date";
import { useSetDate } from "@/store/store";
import { useEffect, useState } from "react";
import { getTrending } from "@/actions/tmdb api/getRequests";
import { toast } from "sonner";
import TitleSkeleton from "@/components/skeletons/title-skeleton";

type Props = {
  initialResults: any[];
};

const TrendingContainer = ({ initialResults }: Props) => {
  const { date } = useSetDate();
  const [results, setResults] = useState(initialResults || []);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!loading) {
      setLoading(true);
      getTrending(date)
        .then((res) => {
          setResults(res.results);
        })
        .catch((err) => {
          console.error(err);
          toast.error("Error fetching trending data.");
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [date]);

  if (loading && results.length === 0) {
    return <TrendingContainerSkeleton />;
  }

  return (
    <section className="space-y-4">
      <div className="flex items-center gap-2">
        <h2 className="text-lg md:text-2xl font-semibold">Trending</h2>
        <ToggleDate />
      </div>

      <CarouselContainer results={results} />
    </section>
  );
};

export default TrendingContainer;

export const TrendingContainerSkeleton = () => {
  return (
    <section className="space-y-4">
      <div className="flex items-center gap-2 ">
        <TitleSkeleton />

        <ToggleDateSkeleton />
      </div>

      <CarouselContainerSkeleton />
    </section>
  );
};
