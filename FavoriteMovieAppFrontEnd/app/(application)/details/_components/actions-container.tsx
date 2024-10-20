import { getYoutubeMediaTrailer } from "@/actions/tmdb api/getRequests";
import ToggleFavorite, {
  ToggleFavoriteSkeleton,
} from "@/components/authenticated/cardActions/toggle-favorite";
import DialogWatchlist, {
  DialogWatchlistSkeleton,
} from "@/components/authenticated/dialogs/dialog-watchlist";
import ActionPlayTrailer from "@/components/clientActions/userActions/action-play-trailer";
import { Video } from "@/types";

type Props = {
  tmdbId: string;
  type: "tv" | "movie";
  title: string;
};

const ActionsContainer = async ({ tmdbId, type, title }: Props) => {
  const youtubeId: Video | undefined = await getYoutubeMediaTrailer(
    tmdbId,
    type
  );
  const mediaItem = {
    tmdbId,
    type,
    title,
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      <ToggleFavorite
        tmdbId={tmdbId}
        type={type}
        className="rounded-full p-2 aspect-square"
        variant={"secondary"}
        size={"lg"}
      />
      <DialogWatchlist
        mediaItem={mediaItem}
        className="rounded-full p-2 aspect-square"
        variant={"secondary"}
        size={"lg"}
      />
      {youtubeId && <ActionPlayTrailer videoId={youtubeId.key.toString()} />}
    </div>
  );
};

export default ActionsContainer;

export const ActionsContainerSkeleton = () => {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <ToggleFavoriteSkeleton />
      <DialogWatchlistSkeleton />
    </div>
  );
};
