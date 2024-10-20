"use client";
import { Button } from "@/components/ui/button";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

const KnownForNav = ({ personId }: { personId: string }) => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const handleMovies = () => {
    const params = new URLSearchParams(searchParams);
    params.set("type", "movie");
    replace(`${pathname}?${params.toString()}`);
  };
  const handleTvShows = () => {
    const params = new URLSearchParams(searchParams);
    params.set("type", "tv");
    replace(`${pathname}?${params.toString()}`);
  };
  const displayView = searchParams.get("type") || "movie";

  return (
    <nav className="space-x-2">
      <Button
        onClick={() => replace(`/details/person/${personId}`)}
        variant={"outline"}
      >
        Back
      </Button>
      <Button
        onClick={handleMovies}
        variant={displayView === "movie" ? "shimmer" : "outline"}
      >
        Movies
      </Button>
      <Button
        onClick={handleTvShows}
        variant={displayView === "tv" ? "shimmer" : "outline"}
      >
        Tv Shows
      </Button>
    </nav>
  );
};

export default KnownForNav;
