"use client";
import React, { useEffect, useState } from "react";
import { getKeyWords } from "@/actions/tmdb api/getRequests";
import { KeyWordType } from "@/types";
import { toast } from "sonner";
import { useDebounce } from "@/hooks/useDebounce";
import { X, SearchIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSearchFilterStore } from "@/store/store-filter-search";
import TitleSkeleton from "@/components/skeletons/title-skeleton";
import InputSkeleton from "@/components/skeletons/input-skeleton";

const KeyWords = () => {
  // querys input for fetch data
  const [query, setQuery] = useState("");
  // fetch results
  const [results, setResults] = useState<KeyWordType[] | []>([]);
  const [loading, setLoading] = useState(false);
  // Control drawer visibility
  const [showDrawer, setShowDrawer] = useState(false);

  // global state
  const { setKeyword } = useSearchFilterStore();

  const debouncedQuery = useDebounce(query, 500);

  useEffect(() => {
    if (!debouncedQuery) return;

    setLoading(true);

    getKeyWords(debouncedQuery)
      .then((res) => {
        setResults(res.results);
      })
      .catch((err) => {
        console.error(err);
        toast.error("Error fetching data.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [debouncedQuery]);

  const handleKeywordSelect = (keyword: KeyWordType) => {
    if (!keyword) return null;
    setKeyword(keyword);
    setQuery(keyword.name);
    setShowDrawer(false);
  };

  const handleClear = () => {
    setQuery("");
    setKeyword(null);
    setShowDrawer(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    setShowDrawer(true);
  };

  return (
    <div className="relative">
      <h2 className="my-2  font-semibold">Keywords</h2>
      <section className="relative">
        <Input
          value={query}
          onChange={handleInputChange}
          className="px-7"
          type="text"
        />

        <SearchIcon className="absolute top-2 left-2" size={18} />
        {query && (
          <Button
            onClick={handleClear}
            className="absolute top-0 right-0"
            variant={"ghost"}
            size={"icon"}
          >
            <X size={18} />
          </Button>
        )}
      </section>

      <div
        className={`overflow-hidden border rounded-lg transition-all duration-500 ease-in-out ${
          showDrawer
            ? "h-[15svh] overflow-y-auto opacity-100"
            : "max-h-0 opacity-0"
        }`}
      >
        {loading ? (
          <p>Loading...</p>
        ) : (
          <>
            {results.length > 0 ? (
              <div className="grid grid-cols-1 gap-1">
                {results.map((item) => (
                  <Button
                    onClick={() => handleKeywordSelect(item)}
                    className="justify-start"
                    key={item.id}
                    variant={"ghost"}
                  >
                    {item.name}
                  </Button>
                ))}
              </div>
            ) : (
              <p className="text-secondary-foreground p-4">No results found.</p>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default KeyWords;

export const KeyWordsSkeleton = () => {
  return (
    <div className="p-2">
      <div className="my-2">
        <TitleSkeleton />
      </div>
      <InputSkeleton />
    </div>
  );
};
