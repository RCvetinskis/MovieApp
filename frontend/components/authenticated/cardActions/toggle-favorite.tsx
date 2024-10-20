"use client";

import { Heart, HeartCrack } from "lucide-react";
import { Button, buttonVariants } from "../../ui/button";
import { useEffect, useState, useTransition } from "react";
import Cookies from "js-cookie";
import {
  addToFavorites,
  getUserFavoriteMediaById,
  removeFromFavorites,
} from "@/actions/backend/favorite";
import HoverLabel from "@/components/hover-label";
import { IFavoriteResponse } from "@/types";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import useUser from "@/hooks/useUser";
import { useSetAuthorizedDialog } from "@/store/store";
import { Skeleton } from "@/components/ui/skeleton";
type Props = {
  type: "tv" | "movie";
  tmdbId: string;
  variant?: VariantProps<typeof buttonVariants>["variant"];
  size?: VariantProps<typeof buttonVariants>["size"];
  className?: string;
};

const ToggleFavorite = ({ type, tmdbId, variant, className, size }: Props) => {
  const [favorite, setFavorite] = useState<IFavoriteResponse | null>(null);
  const [isPending, startTransition] = useTransition();
  const { setOpen } = useSetAuthorizedDialog();
  const router = useRouter();
  const { user } = useUser();

  useEffect(() => {
    if (!user) return;
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

    startTransition(() => {
      if (!user) {
        setOpen(true);
        return;
      }
      isSame
        ? removeFromFavorites(type, tmdbId)
            .then((res) => {
              if (res) {
                setFavorite(null);
                router.refresh();
                toast.success("Remove from favorites");
              }
            })
            .catch((e) => toast.error(e.message))
        : addToFavorites(type, tmdbId)
            .then((res) => {
              setFavorite(res.result);
              router.refresh();
              toast.success(res.message);
            })
            .catch(() => setFavorite(null));
    });
  };
  return (
    <HoverLabel asChild label={label}>
      <Button
        onClick={handleClick}
        disabled={isPending}
        size={size}
        variant={variant ? variant : "ghost"}
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
