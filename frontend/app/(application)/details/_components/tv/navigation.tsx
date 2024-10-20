"use client";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { usePathname } from "next/navigation";

type Props = {
  id: string;
  seasonsLength: number;
};

const Navigation = ({ id, seasonsLength }: Props) => {
  const pathname = usePathname();
  const isOnSeasonsPage = pathname.endsWith(`/seasons`);
  const isOnSeasonDetailPage = pathname.includes(`/seasons/`);

  return (
    <nav className="px-4">
      {isOnSeasonsPage ? (
        <Link href={`/details/tv/${id}`}>
          <Button
            variant="outline"
            className="md:text-lg text-muted-foreground"
          >
            Back to TV Show
          </Button>
        </Link>
      ) : isOnSeasonDetailPage ? (
        <Link href={`/details/tv/${id}/seasons`}>
          <Button
            variant="outline"
            className="md:text-lg  text-muted-foreground"
          >
            Back to Seasons
          </Button>
        </Link>
      ) : (
        <Link href={`/details/tv/${id}/seasons`}>
          <Button
            variant="outline"
            className=" md:text-lg  text-muted-foreground"
          >
            Seasons
            <span>({seasonsLength})</span>
          </Button>
        </Link>
      )}
    </nav>
  );
};

export default Navigation;
