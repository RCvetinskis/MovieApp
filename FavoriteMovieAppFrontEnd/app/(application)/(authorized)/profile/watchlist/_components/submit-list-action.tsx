"use client";
import { addWatchlist, editWatchlist } from "@/actions/backend/watchlist";
import { Button } from "@/components/ui/button";
import { IWatchListPostRequest } from "@/types";
import React, { useTransition } from "react";
import Cookies from "js-cookie";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { useWatchListStore } from "@/store/store-watchlist";

// TODO: display public watchlists to users
type Props = {
  watchList: IWatchListPostRequest;
};

const SubmitListAction = ({ watchList }: Props) => {
  const { toast } = useToast();
  const userId = Cookies.get("userId");
  const token = Cookies.get("auth_token");

  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const { watchlistId } = useWatchListStore();
  const handleSave = () => {
    if (!userId || !token || !watchList) return;

    // Construct the request body as a plain object
    const requestBody: IWatchListPostRequest = {
      name: watchList.name || "",
      description: watchList.description || "",
      public: watchList.public || false,
      imageUrl: watchList.imageUrl || "",
      mediaItems: [],
    };

    if (watchList.mediaItems.length > 0) {
      requestBody.mediaItems = watchList.mediaItems.map((item) => ({
        type: item.media_type || "movie",
        tmdbId: item.id.toString(),
        title: item.title ? item.title : item.name,
      }));
    }
    startTransition(() => {
      if (!watchlistId) {
        addWatchlist(userId, requestBody, token)
          .then((res) => {
            toast({
              title: "Success",
              description: res.message,
            });
            router.refresh();
            router.push(res.watchlistId);
          })
          .catch((e) => {
            toast({
              title: "Failure",
              description: e.message,
              variant: "destructive",
            });
          });
      } else {
        editWatchlist(watchlistId, requestBody)
          .then((res) => {
            toast({
              title: "Success",
              description: res.message,
            });
            router.refresh();
            router.push(`/profile/watchlist/${res.watchlistId}`);
          })
          .catch((e) => {
            toast({
              title: "Failure",
              description: e.message,
              variant: "destructive",
            });
          });
      }
    });
  };

  return (
    <Button
      disabled={isPending}
      onClick={handleSave}
      className="w-fit"
      variant={"shimmer"}
    >
      Save List
    </Button>
  );
};

export default SubmitListAction;
