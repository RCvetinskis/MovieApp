import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

import ToggleFavorite from "./toggle-favorite";
import Details from "./details";
import DialogWatchlist from "../dialogs/dialog-watchlist";

type Props = {
  children: React.ReactNode;
  mediaItem: {
    type: "tv" | "movie";
    tmdbId: string;
    title: string;
  };
};

const HoverContent = ({ children, mediaItem }: Props) => {
  const { type, tmdbId } = mediaItem;
  return (
    <HoverCard openDelay={0}>
      <HoverCardTrigger asChild>{children}</HoverCardTrigger>
      <HoverCardContent className="rounded-lg" side="bottom" align="center">
        <div className="p-2 flex items-center gap-3">
          <ToggleFavorite type={type} tmdbId={tmdbId} />
          <DialogWatchlist mediaItem={mediaItem} />
          <Details type={type} tmdbId={tmdbId} />
        </div>
      </HoverCardContent>
    </HoverCard>
  );
};

export default HoverContent;
