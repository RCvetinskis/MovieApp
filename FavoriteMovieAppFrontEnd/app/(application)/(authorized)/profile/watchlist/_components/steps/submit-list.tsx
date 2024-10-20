"use client";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { useWatchListStore } from "@/store/store-watchlist";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import CardContentSubmitList from "../card-content-submit-list";
import SubmitListAction from "../submit-list-action";

const SubmitList = () => {
  const { watchList } = useWatchListStore();
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    if (!watchList.name) {
      const params = new URLSearchParams(searchParams.toString());
      params.delete("navStep");
      router.push(`?${params.toString()}`);
    }
  }, [watchList.name, router]);

  const isImage = watchList.imageUrl.length > 0;

  return (
    <Card className="relative p-6 shadow-lg rounded-lg ">
      {isImage && (
        <div
          className="absolute inset-0 z-0 opacity-20"
          style={{
            backgroundImage: `url(${watchList.imageUrl})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            filter: "blur(10px)",
          }}
        />
      )}

      <div className="relative z-10">
        <CardHeader className="mb-4 space-y-4">
          <CardTitle className="text-2xl font-semibold">
            {watchList.name}
          </CardTitle>
          {isImage && (
            <div className="w-24 h-24">
              <Image
                alt="Watchlist view"
                src={watchList.imageUrl}
                width={80}
                height={80}
                className="rounded-full aspect-square object-cover"
              />
            </div>
          )}

          <CardDescription className="text-sm italic text-gray-300">
            {watchList.description || "No description provided."}
          </CardDescription>

          {/* submit save list */}
          <SubmitListAction watchList={watchList} />
        </CardHeader>

        {/* list of cards */}
        <CardContentSubmitList />
      </div>
    </Card>
  );
};

export default SubmitList;
