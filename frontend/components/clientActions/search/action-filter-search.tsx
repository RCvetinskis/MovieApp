"use client";
import React, { useTransition } from "react";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useSearchFilterStore } from "@/store/store-filter-search";
import { Button } from "@/components/ui/button";

const ActionFilterSearch = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const page = searchParams.get("page") ?? "1";
  const pathname = usePathname();
  const type = pathname.split("/")[1] || "";

  const [isPending, startTransition] = useTransition();

  const {
    language,
    keyword,
    genres,
    releaseDateFrom,
    releaseDateTo,
    scoreFrom,
    scoreTo,
    sortBy,
  } = useSearchFilterStore();

  const genresIds = genres.map((item) => item.id.toString());
  const keyWordParam = keyword?.id.toString();

  // Function to determine if any filters or sort options are set
  const hasFiltersOrSort = () => {
    return (
      language !== undefined ||
      releaseDateFrom !== undefined ||
      releaseDateTo !== undefined ||
      sortBy !== undefined ||
      scoreFrom !== undefined ||
      scoreTo !== undefined ||
      genresIds.length > 0 ||
      keyWordParam !== null
    );
  };

  const handleSearch = () => {
    startTransition(() => {
      const queryParams = new URLSearchParams({
        with_original_language: language ?? "en",
        page,
        ...(releaseDateFrom && { release_date_gte: releaseDateFrom }),
        ...(releaseDateTo && { release_date_lte: releaseDateTo }),
        ...(sortBy && { sort_by: sortBy }),
        ...(scoreFrom && { vote_average_gte: scoreFrom }),
        ...(scoreTo && { vote_average_lte: scoreTo }),
        ...(genresIds.length > 0 && { with_genres: genresIds.join(",") }),
        ...(keyWordParam && { with_keywords: keyWordParam }),
      });

      const url = `/${type}?${queryParams.toString()}`;
      router.push(url);
    });
  };

  return (
    <Button
      disabled={isPending || !hasFiltersOrSort()}
      onClick={handleSearch}
      size={"lg"}
      variant={"shimmer"}
      className="w-full"
    >
      Search
    </Button>
  );
};

export default ActionFilterSearch;
