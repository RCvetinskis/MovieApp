import { CardFooter } from "@/components/ui/card";
import KnownForCarousel from "./_components/known-for-carousel";

type Props = {
  params: {
    personId: string;
  };
};

const PersonPage = async ({ params }: Props) => {
  const personId = params.personId;

  return (
    <CardFooter className="w-full  md:p-10 ">
      <KnownForCarousel personId={personId} type="movie" />
    </CardFooter>
  );
};

export default PersonPage;
