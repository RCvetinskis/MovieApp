"use client";
import { useEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import useOnClickOutside from "@/hooks/useClickOutSide";
import SearchResults from "../search/search-results";
import SearchCard from "../search/search-card";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { LabelInputContainer } from "@/components/ui/label-input-container";
import { Label } from "@/components/ui/label";
import { useWatchListStore } from "@/store/store-watchlist";
import { useRouter, useSearchParams } from "next/navigation";
import { useLoadMore } from "@/hooks/useLoadMore";

const AddItems = () => {
  const [query, setQuery] = useState("");
  const [showSearchOutput, setShowSearchOutput] = useState<boolean>(false);

  const searchOutputRef = useRef<HTMLDivElement>(null);

  const searchParams = useSearchParams();
  const router = useRouter();
  const { watchList, removeMediaItem } = useWatchListStore();

  useEffect(() => {
    if (watchList.name.length <= 0) {
      const params = new URLSearchParams(searchParams.toString());
      params.delete("navStep");
      router.push(`?${params.toString()}`);
    }
  }, [watchList.name, router]);

  const mediaItems = watchList.mediaItems;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    setShowSearchOutput(true);
  };
  // fetch and display items by tmdbid
  useOnClickOutside(searchOutputRef, () => setShowSearchOutput(false));
  const handleClose = () => {
    setShowSearchOutput(false);
  };

  const handleRemove = (tmdbId: string) => {
    removeMediaItem(tmdbId.toString());
  };

  const handleClearInput = () => {
    setQuery("");
    handleClose();
  };

  const handleNavigate = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("navStep", "chooseImage");
    router.push(`?${params.toString()}`);
  };

  const { visibleItems, loadMore, hasMore } = useLoadMore(mediaItems);
  return (
    <div className="relative space-y-6" ref={searchOutputRef}>
      <LabelInputContainer className="relative">
        <Label>Add item to a list </Label>
        <Input
          className="w-full"
          type="text"
          value={query}
          placeholder="Search for a movie or TV show..."
          onChange={handleChange}
        />
        {query && (
          <Button
            onClick={handleClearInput}
            variant={"ghost"}
            className="absolute top-4 right-0"
          >
            <X />
          </Button>
        )}
      </LabelInputContainer>

      {showSearchOutput && query && (
        <SearchResults query={query} handleClose={handleClose} />
      )}

      <div className="flex flex-col gap-3 max-h-[60vh] overflow-x-auto">
        {visibleItems.map((item: any) => (
          <div className="relative" key={item.id}>
            <SearchCard handleClose={() => null} item={item} />
            <Button
              onClick={() => handleRemove(item.id)}
              className="absolute top-0 right-0"
              variant={"ghost"}
            >
              <X />
            </Button>
          </div>
        ))}
        {hasMore && (
          <div className="flex justify-center my-4">
            <Button variant={"secondary"} onClick={loadMore}>
              Load More
            </Button>
          </div>
        )}
      </div>
      <Button onClick={handleNavigate} variant={"secondary"}>
        Continue
      </Button>
    </div>
  );
};

export default AddItems;
