import { getSearchResults } from "@/actions/tmdb api/getRequests";
import { useDebounce } from "@/hooks/useDebounce";
import React, { useEffect, useState } from "react";
import SearchCard from "./search-card";

type Props = {
  query: string;
  handleClose: () => void;
};

const SearchResults = ({ query, handleClose }: Props) => {
  const [data, setData] = useState<any[] | []>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const debouncedQuery = useDebounce(query, 500);
  useEffect(() => {
    if (!query) return;

    setLoading(true);
    getSearchResults(query, "multi")
      .then((res) => {
        const results = res.results.filter(
          (item: any) => item.media_type !== "person"
        );
        setData(results);
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [debouncedQuery]);

  return (
    <div className="absolute left-0 top-11 max-h-screen min-h-[40svh] overflow-x-auto rounded-lg bg-primary-foreground shadow-2xl p-2 w-full pb-24 z-40">
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="space-y-1 w-full ">
          {data?.length > 0 ? (
            <>
              {data.map((item) => (
                <SearchCard
                  key={item.id}
                  item={item}
                  handleClose={handleClose}
                />
              ))}
            </>
          ) : (
            <div className="w-full h-40 flex justify-center items-center text-lg font-semibold">
              <p>No results found.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchResults;
