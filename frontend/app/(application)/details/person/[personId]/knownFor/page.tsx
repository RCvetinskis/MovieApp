import { getMediaBelongingToPerson } from "@/actions/tmdb api/getRequests";
import KnownForNav from "./_components/knownFor-nav";
import { CardFooter } from "@/components/ui/card";
import CardsContainer from "@/components/cards/cards-container";
import PaginationContainer from "@/components/pagination/pagination-container";
import { limit } from "@/lib/constants";

type Props = {
  params: {
    personId: string;
  };
  searchParams: {
    type?: string;
    page?: string;
  };
};

const KnownForPage = async ({ params, searchParams }: Props) => {
  const personId = params.personId;
  const type = searchParams.type || "movie";
  const page = Number(searchParams.page) || 1;

  if (type !== "tv" && type !== "movie") {
    return <div>No Results found</div>;
  }

  const media = await getMediaBelongingToPerson(personId, type, page, limit);

  if (!media || media.results.length <= 0) return <div>No Results found</div>;

  const totalPages = Math.min(media.totalPages, 500);

  return (
    <CardFooter className="w-full flex flex-col items-start space-y-4 p-2 lg:p-4">
      <KnownForNav personId={personId} />

      <CardsContainer results={media.results} />

      <footer className="py-6">
        <PaginationContainer totalPages={totalPages} />
      </footer>
    </CardFooter>
  );
};

export default KnownForPage;
