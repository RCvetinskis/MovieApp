import CardsContainer from "@/components/cards/cards-container";

type Props = {
  results: any[];
};

const SearchResults = ({ results }: Props) => {
  if (results.length <= 0)
    return (
      <div className="w-full h-40 flex justify-center items-center text-lg font-semibold">
        <p>No results found.</p>
      </div>
    );
  return (
    <div>
      <CardsContainer results={results} />
    </div>
  );
};

export default SearchResults;
