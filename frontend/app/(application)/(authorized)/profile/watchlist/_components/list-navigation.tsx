"use client";

import { Button } from "@/components/ui/button";
import { useWatchListStore } from "@/store/store-watchlist";
import { useRouter, useSearchParams } from "next/navigation";

type Props = {
  isEdit: boolean;
};

const ListNavigation = ({ isEdit }: Props) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const navStep = searchParams.get("navStep");

  const { watchList } = useWatchListStore();
  const handleToggle = (step?: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (step) {
      params.set("navStep", step);
    } else {
      params.delete("navStep");
    }

    router.push(`?${params.toString()}`);
  };

  const isDisabled = watchList.name.length <= 0;
  return (
    <div className="flex items-center flex-wrap gap-2">
      <Button
        onClick={() => handleToggle()}
        variant={!navStep ? "shimmer" : "outline"}
      >
        Edit List
      </Button>
      <Button
        disabled={isDisabled}
        onClick={() => handleToggle("addItems")}
        variant={navStep === "addItems" ? "shimmer" : "outline"}
      >
        Add/Edit items
      </Button>
      <Button
        disabled={isDisabled}
        onClick={() => handleToggle("chooseImage")}
        variant={navStep === "chooseImage" ? "shimmer" : "outline"}
      >
        Choose Image
      </Button>
      <Button
        disabled={isDisabled}
        onClick={() => handleToggle("submit")}
        variant={navStep === "submit" ? "shimmer" : "outline"}
      >
        Submit
      </Button>
      {isEdit && (
        <Button
          disabled={isDisabled}
          onClick={() => handleToggle("delete")}
          variant={navStep === "delete" ? "shimmer" : "destructive"}
        >
          Delete
        </Button>
      )}
    </div>
  );
};

export default ListNavigation;
