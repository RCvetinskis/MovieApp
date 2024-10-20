"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useDebounce } from "@/hooks/useDebounce";
import { X } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { ChangeEvent, useEffect, useState } from "react";

const SearchListInput = () => {
  const [query, setQuery] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();
  const handleClear = () => {
    setQuery("");
  };

  const debouncedQuery = useDebounce(query, 500);

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
  };
  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    if (debouncedQuery) {
      params.set("query", debouncedQuery);
    } else {
      params.delete("query");
    }
    const queryString = params.toString();
    if (queryString !== searchParams.toString()) {
      router.push(`?${params.toString()}`);
    }
  }, [debouncedQuery, router, searchParams]);

  return (
    <div className="max-w-[400px] w-full">
      <div className="relative flex-grow">
        <Input
          value={query}
          onChange={(e) => handleSearch(e)}
          type="text"
          placeholder="Search..."
        />
        {query && (
          <Button
            onClick={handleClear}
            size={"sm"}
            className="absolute top-1 right-1"
            variant={"ghost"}
          >
            <X />
          </Button>
        )}
      </div>
    </div>
  );
};

export default SearchListInput;
