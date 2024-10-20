import { Button } from "@/components/ui/button";
import { CardContent } from "@/components/ui/card";
import { useLoadMore } from "@/hooks/useLoadMore";
import { useWatchListStore } from "@/store/store-watchlist";
import React from "react";
import SearchCard from "./search/search-card";

const CardContentSubmitList = () => {
  const { watchList } = useWatchListStore();
  const { visibleItems, loadMore, hasMore } = useLoadMore(watchList.mediaItems);
  return (
    <div>
      <CardContent className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {visibleItems.map((item: any) => (
          <SearchCard key={item.id} item={item} handleClose={() => null} />
        ))}
      </CardContent>

      {hasMore && (
        <div className="flex justify-center my-4">
          <Button variant={"secondary"} onClick={loadMore}>
            Load More
          </Button>
        </div>
      )}
    </div>
  );
};

export default CardContentSubmitList;
