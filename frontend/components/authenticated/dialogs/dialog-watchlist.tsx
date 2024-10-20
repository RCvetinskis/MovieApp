"use client";
import ButtonLink from "@/components/buttons/button-link";
import { WatchlistCombobox } from "@/components/comboboxes/watchlist-combox";
import HoverLabel from "@/components/hover-label";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import useUser from "@/hooks/useUser";
import { cn } from "@/lib/utils";
import { useSetAuthorizedDialog } from "@/store/store";
import { VariantProps } from "class-variance-authority";
import { ListIcon } from "lucide-react";

type Props = {
  mediaItem: {
    type: "tv" | "movie";
    tmdbId: string;
    title: string;
  };
  variant?: VariantProps<typeof buttonVariants>["variant"];
  size?: VariantProps<typeof buttonVariants>["size"];
  className?: string;
};

const DialogWatchlist = ({ mediaItem, variant, className, size }: Props) => {
  const { user } = useUser();
  const { setOpen } = useSetAuthorizedDialog();
  const handleClick = () => {
    if (!user) {
      return setOpen(true);
    }
    return;
  };
  return (
    <Dialog>
      <HoverLabel asChild label="Add to watchlist">
        <DialogTrigger asChild>
          <Button
            onClick={handleClick}
            size={size}
            variant={variant ? variant : "ghost"}
            className={cn(className)}
          >
            <ListIcon />
          </Button>
        </DialogTrigger>
      </HoverLabel>
      {user ? (
        <DialogContent className="dark:bg-black/70  bg-primary-foreground">
          <DialogHeader>
            <DialogTitle>Select Watchlist</DialogTitle>
            <DialogDescription className="flex flex-col gap-2">
              <ButtonLink
                location="/profile/watchlist/new"
                title="+ Create New List"
              />

              <WatchlistCombobox mediaItem={mediaItem} />
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      ) : null}
    </Dialog>
  );
};

export default DialogWatchlist;

export const DialogWatchlistSkeleton = () => {
  return (
    <Skeleton className="w-12 h-12 bg-gray-500 rounded-full aspect-square" />
  );
};
