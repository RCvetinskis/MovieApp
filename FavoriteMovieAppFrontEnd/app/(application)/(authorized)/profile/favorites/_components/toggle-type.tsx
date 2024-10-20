"use client";
import React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";

const ToggleType = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const type = searchParams.get("type");
  const handleToggle = (type?: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (type) {
      params.set("type", type);
    } else {
      params.delete("type");
    }

    router.push(`?${params.toString()}`);
  };

  return (
    <div className="w-full flex">
      <Button
        onClick={() => handleToggle(undefined)}
        variant={!type ? "shimmer" : "outline"}
      >
        All
      </Button>
      <Button
        onClick={() => handleToggle("movie")}
        variant={type === "movie" ? "shimmer" : "outline"}
      >
        Movies
      </Button>
      <Button
        onClick={() => handleToggle("tv")}
        variant={type === "tv" ? "shimmer" : "outline"}
      >
        Tv Shows
      </Button>
    </div>
  );
};
export default ToggleType;
