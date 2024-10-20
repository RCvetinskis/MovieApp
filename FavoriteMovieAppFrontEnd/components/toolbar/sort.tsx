"use client";
import { CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { SortOptions } from "@/types";
import OpenDrawer, { OpenDrawerHeaderSkeleton } from "./open-drawer";
import { sortMovieOptions, sortTvOptions } from "@/lib/constants";
import { useSearchFilterStore } from "@/store/store-filter-search";
import { usePathname } from "next/navigation";
import InputSkeleton from "../skeletons/input-skeleton";

const Sort = () => {
  const pathname = usePathname();
  const type = pathname.split("/")[1] || "";
  const { setSortBy } = useSearchFilterStore();
  let sortOptions: SortOptions[] = [];
  if (type.includes("movie")) {
    sortOptions = sortMovieOptions;
  } else if (type.includes("tv")) {
    sortOptions = sortTvOptions;
  } else {
    sortOptions = [];
  }
  return (
    <OpenDrawer title="Sort">
      <CardContent className="p-2 pb-4">
        <Select onValueChange={(value) => setSortBy(value)}>
          <SelectTrigger>
            <SelectValue placeholder="Sort Results By" />
          </SelectTrigger>
          <SelectContent>
            {sortOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </CardContent>
    </OpenDrawer>
  );
};

export default Sort;

export const SortSkeleton = () => {
  return (
    <div className="bg-card shadow rounded-xl">
      <OpenDrawerHeaderSkeleton />
      <div className="p-2 pb-4">
        <InputSkeleton />
      </div>
    </div>
  );
};
