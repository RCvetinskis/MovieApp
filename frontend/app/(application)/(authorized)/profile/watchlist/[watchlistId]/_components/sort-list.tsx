"use client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter, useSearchParams } from "next/navigation";

const options = [
  {
    value: "original",
    label: "Original Order",
  },
  {
    value: "title_az",
    label: "Title A-Z",
  },
  {
    value: "title_za",
    label: "Title Z-A",
  },
  {
    value: "addedAt_asc",
    label: "Added At Ascending",
  },
  {
    value: "addedAt_desc",
    label: "Added At Descending",
  },
  {
    value: "tv_first",
    label: "Tv Shows first",
  },
  {
    value: "movie_frist",
    label: "Movies first",
  },
];
const SortList = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleSort = (value: string) => {
    if (!value) return;

    const params = new URLSearchParams(searchParams);
    params.set("sortBy", value);
    router.push(`?${params.toString()}`);
  };
  return (
    <Select onValueChange={handleSort}>
      <SelectTrigger className="w-[220px] bg-secondary">
        <SelectValue placeholder="Sort By" />
      </SelectTrigger>
      <SelectContent>
        {options.map((item) => (
          <SelectItem key={item.value} value={item.value}>
            {item.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default SortList;
