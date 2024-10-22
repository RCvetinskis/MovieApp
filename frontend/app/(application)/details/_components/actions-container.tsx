import { getYoutubeMediaTrailer } from "@/actions/tmdb api/getRequests";
import ToggleFavorite, {
  ToggleFavoriteSkeleton,
} from "@/components/authenticated/cardActions/toggle-favorite";
import DialogWatchlist, {
  DialogWatchlistSkeleton,
} from "@/components/authenticated/dialogs/dialog-watchlist";
import ActionPlayTrailer from "@/components/clientActions/userActions/action-play-trailer";
import { IMediaItemForReactProps, Video } from "@/types";

type Props = {
  mediaItem: IMediaItemForReactProps;
};

const ActionsContainer = async ({ mediaItem }: Props) => {
  const youtubeId: Video | undefined = await getYoutubeMediaTrailer(
    mediaItem.tmdbId,
    mediaItem.type
  );

  return (
    <div className="flex flex-wrap items-center gap-2">
      <ToggleFavorite
        mediaItem={mediaItem}
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
