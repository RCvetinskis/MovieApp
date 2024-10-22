"use client";

import { Heart, HeartCrack } from "lucide-react";
import { Button, buttonVariants } from "../../ui/button";
import { useEffect, useState, useTransition } from "react";
import {
  addToFavorites,
  getUserFavoriteMediaById,
  removeFromFavorites,
} from "@/actions/backend/favorite";
import HoverLabel from "@/components/hover-label";
import { IFavoriteResponse, IMediaItemForReactProps } from "@/types";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { useSetAuthorizedDialog } from "@/store/store";
import { Skeleton } from "@/components/ui/skeleton";
import { useUserStore } from "@/store/store-user";
type Props = {
  mediaItem: IMediaItemForReactProps;
  variant?: VariantProps<typeof buttonVariants>["variant"];
  size?: VariantProps<typeof buttonVariants>["size"];
  className?: string;
};

const ToggleFavorite = ({ mediaItem, variant, className, size }: Props) => {
  const [favorite, setFavorite] = useState<IFavoriteResponse | null>(null);
  const [isPending, startTransition] = useTransition();
  const { setOpen } = useSetAuthorizedDialog();
  const router = useRouter();
  const { user } = useUserStore();
  const { type, tmdbId } = mediaItem;

  useEffect(() => {
    getUserFavoriteMediaById(type, tmdbId)
      .then((res) => {
        setFavorite(res.result);
      })
      .catch(() => {
        setFavorite(null);
      });
  }, [type, tmdbId]);

  const isSameTmdb = favorite?.mediaItem.tmdbId === tmdbId.toString();
  const isSameType = favorite?.mediaItem.type.toLocaleLowerCase() === type;
  const isSame = favorite && isSameTmdb && isSameType;

  const HeartIcon = isSame ? HeartCrack : Heart;
  const label = isSame ? "Remove from favorites" : "Add to favorites";

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();

    startTransition(async () => {
      if (!user) {
        setOpen(true);
        return;
      }

      const prevFavorite = favorite;

      if (isSame) {
        setFavorite(null); // Optimistic removal

        try {
          const res = await removeFromFavorites(
            mediaItem.type,
            mediaItem.tmdbId
          );
          if (!res) throw new Error("Failed to remove from favorites");
          router.refresh();
          toast.success("Removed from favorites");
        } catch (error) {
          setFavorite(prevFavorite); // Revert on error
          toast.error("Failed to remove from favorites");
        }
      } else {
        const newFavorite = {
          id: (Math.random() * 1001).toString(),
          userId: user.id,
          mediaItem: {
            id: (Math.random() * 1001).toString(),
            tmdbId,
            type,
          },
        }; // Optimistic addition
        setFavorite(newFavorite);

        try {
          const res = await addToFavorites(mediaItem);
          setFavorite(res.result);
          router.refresh();
          toast.success(res.message);
        } catch (error) {
          setFavorite(prevFavorite); // Revert on error
          toast.error("Failed to add to favorites");
        }
      }
    });
  };
  return (
    <HoverLabel asChild label={label}>
      <Button
        onClick={handleClick}
        disabled={isPending}
        size={size}
        variant={variant ?? "ghost"}
        className={cn(className)}
      >
        <HeartIcon />
      </Button>
    </HoverLabel>
  );
};

export default ToggleFavorite;

export const ToggleFavoriteSkeleton = () => {
  return (
    <Skeleton className="w-12 h-12 bg-gray-500 rounded-full aspect-square" />
  );
};
