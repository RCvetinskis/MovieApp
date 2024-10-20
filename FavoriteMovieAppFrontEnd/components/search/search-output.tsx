"use client";
import { useEffect, useState, useMemo } from "react";
import { getSearchResults } from "@/actions/tmdb api/getRequests";
import { toast } from "sonner";
import { useDebounce } from "@/hooks/useDebounce";
import SearchCard from "../cards/search/search-card";
import { MovieApiResponse } from "@/types";

type Props = {
  query: string;
  category?: string;
};

const SearchOutPut = ({ query, category = "multi" }: Props) => {
  const [data, setData] = useState<MovieApiResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const debouncedQuery = useDebounce(query, 500);
  useEffect(() => {
    if (!query) return;

    setLoading(true);
    getSearchResults(query, category)
      .then((res) => {
        setData(res);
      })
      .catch((err) => {
        console.error(err);
        toast.error("Error fetching data.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [debouncedQuery]);

  const personResults = useMemo(
    () => data?.results?.filter((item) => item.media_type === "person") || [],
    [data]
  );

  const movieResults = useMemo(
    () => data?.results?.filter((item) => item.media_type === "movie") || [],
    [data]
  );

  const tvResults = useMemo(
    () => data?.results?.filter((item) => item.media_type === "tv") || [],
    [data]
  );

  return (
    <div className="absolute left-0 top-11 max-h-screen min-h-[40svh] overflow-x-auto rounded-lg bg-primary-foreground shadow-2xl p-2 w-full pb-24">
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="space-y-1 w-full ">
          {data?.results?.length ? (
            <>
              {movieResults.length > 0 && (
                <h3 className="py-2 text-lg font-semibold">Movies</h3>
              )}

              {movieResults.map((item) => (
                <SearchCard
                  type={"movie"}
                  tmdbId={item.id}
                  key={item.id}
                  title={item.title}
                  releaseDate={item.release_date}
                  overview={item.overview}
                  posterPath={item.poster_path}
                />
              ))}
              {tvResults.length > 0 && (
                <h3 className="py-2 text-lg font-semibold">Tv Shows</h3>
              )}
              {tvResults.map((item) => (
                <SearchCard
                  type={"tv"}
                  tmdbId={item.id}
                  key={item.id}
                  title={item.title ? item.title : item.name}
                  releaseDate={
                    item.release_date ? item.release_date : item.first_air_date
                  }
                  overview={item.overview}
                  posterPath={item.poster_path}
                />
              ))}
              {personResults.length > 0 && (
                <h3 className="py-2 text-lg font-semibold">People</h3>
              )}
              {personResults.map((item) => (
                <SearchCard
                  type={"person"}
                  tmdbId={item.id}
                  key={item.id}
                  title={item.name}
                  overview={`Known for ${item.known_for_department}`}
                  posterPath={item.profile_path}
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

export default SearchOutPut;
