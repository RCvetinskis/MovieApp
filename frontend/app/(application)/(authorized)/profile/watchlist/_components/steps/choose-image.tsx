"use client";
import ImageCard from "../image-card";
import { useEffect, useState } from "react";
import { useWatchListStore } from "@/store/store-watchlist";
import { Button } from "@/components/ui/button";
import { useRouter, useSearchParams } from "next/navigation";

type Props = {};
// TODO: Select Image with store, not selected state
const ChooseImage = (props: Props) => {
  const { watchList, setWatchListImage } = useWatchListStore();
  const mediaItems = watchList.mediaItems;

  const [selected, setSelected] = useState("");

  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    if (watchList.name.length <= 0) {
      const params = new URLSearchParams(searchParams.toString());
      params.delete("navStep");
      router.push(`?${params.toString()}`);
    }
  }, [watchList.name, router]);

  const handleNavigate = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("navStep", "submit");
    router.push(`?${params.toString()}`);
  };
  const handleNavigateBack = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("navStep", "addItems");
    router.push(`?${params.toString()}`);
  };
  const handleSelect = (image: string) => {
    if (selected === image) {
      setSelected("");
    } else {
      setSelected(image);
      setWatchListImage(image);
    }
  };

  return (
    <div className="space-y-6">
      {mediaItems.length > 0 ? (
        <div className="flex flex-wrap gap-5 items-center">
          {mediaItems.map((item: any) => (
            <ImageCard
              key={item.id}
              item={item}
              selected={selected}
              onSelect={handleSelect}
            />
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          <p className="text-lg "> To choose Image you must add some items</p>
          <Button onClick={handleNavigateBack} variant={"outline"}>
            Back
          </Button>
        </div>
      )}

      <Button onClick={handleNavigate} variant={"secondary"}>
        Continue
      </Button>
    </div>
  );
};

export default ChooseImage;
