"use client";
import { IMediaItem, IWatchListResponse } from "@/types";
import AddItems from "../../../_components/steps/add-items";
import ChooseImage from "../../../_components/steps/choose-image";
import DeleteList from "../../../_components/steps/delete-list";
import SubmitList from "../../../_components/steps/submit-list";
import EditList from "../../../_components/steps/edit-list";
import { useEffect } from "react";
import { useWatchListStore } from "@/store/store-watchlist";
import { fetchMoviesByids } from "@/actions/tmdb api/getRequests";

type Props = {
  defaultWatchlist: IWatchListResponse;
  defaultMediaItems: IMediaItem[];
  navStep?: string;
};

const EditWatchlistContainer = ({
  defaultWatchlist,
  defaultMediaItems,
  navStep,
}: Props) => {
  const {
    setWatchListName,
    setWatchListDescription,
    setWatchListPublic,
    setWatchListImage,
    addMediaItem,
    setWatchlistId,
  } = useWatchListStore();

  //   SET default values for store from watchlist database
  useEffect(() => {
    setWatchlistId(defaultWatchlist.id);
    setWatchListName(defaultWatchlist.name);
    setWatchListDescription(defaultWatchlist.description || "");
    setWatchListPublic(defaultWatchlist.public);
    setWatchListImage(defaultWatchlist.imageUrl || "");

    const fetchAndSetMediaItems = async () => {
      try {
        const mediaItems = await fetchMoviesByids(defaultMediaItems);
        mediaItems.forEach((item) => addMediaItem(item));
      } catch (error) {
        console.error("Error setting media items:", error);
      }
    };

    if (defaultMediaItems && defaultMediaItems.length > 0) {
      fetchAndSetMediaItems();
    }
  }, []);

  return (
    <main>
      {navStep === "addItems" ? (
        <AddItems />
      ) : navStep === "chooseImage" ? (
        <ChooseImage />
      ) : navStep === "delete" ? (
        <DeleteList watclistId={defaultWatchlist.id} />
      ) : navStep === "submit" ? (
        <SubmitList />
      ) : (
        <EditList />
      )}
    </main>
  );
};

export default EditWatchlistContainer;
