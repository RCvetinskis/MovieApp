import MainCard, { MainCardSkeleton } from "@/components/cards/main-card";

type Props = {
  results: any[];
};

const CardsContainer = ({ results }: Props) => {
  return (
    <div className="grid grid-cols-1  md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5  gap-10">
      {results.map((item) => (
        <MainCard item={item} key={item.id} />
      ))}
    </div>
  );
};

export default CardsContainer;

export const CardsContainerSkeleton = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4  2xl:grid-cols-5 gap-10">
      {[...Array(20)].map((_, i) => (
        <MainCardSkeleton key={i} />
      ))}
    </div>
  );
};
