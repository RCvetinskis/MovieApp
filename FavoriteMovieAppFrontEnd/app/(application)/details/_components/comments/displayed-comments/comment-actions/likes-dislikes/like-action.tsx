"use client";
import { getLikeByCommentId, postLike } from "@/actions/backend/like";
import LoaderSpinner from "@/components/animated/loader-spinner";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useSetAuthorizedDialog } from "@/store/store";
import { ILike } from "@/types";
import { ThumbsUp } from "lucide-react";
import { useMemo, useEffect, useState, useTransition } from "react";

type Props = {
  commentId: string;
  currentUserId?: string;
  like: ILike | null;
  setLike: (like: ILike | null) => void;
  handleLikeToggle: (like: ILike | null) => void;
};

const LikeAction = ({
  commentId,
  currentUserId,
  like,
  setLike,
  handleLikeToggle,
}: Props) => {
  const [isPending, startTransition] = useTransition();
  const [loading, setLoading] = useState(false);
  const { setOpen } = useSetAuthorizedDialog();

  useEffect(() => {
    const getLike = async () => {
      setLoading(true);
      try {
        const response = await getLikeByCommentId(commentId);
        setLike(response);
      } catch (error) {
        console.error("Error fetching like data:", error);
      } finally {
        setLoading(false);
      }
    };
    getLike();
  }, [commentId]);

  const isLiked = useMemo(() => {
    return currentUserId ? like?.userId === currentUserId : false;
  }, [currentUserId, like]);

  const handleLike = () => {
    if (!currentUserId) {
      setOpen(true);
      return;
    }
    startTransition(async () => {
      setLoading(true);
      // optimistycal update
      if (isLiked) {
        handleLikeToggle(null);
      } else {
        const newLike: ILike = {
          userId: currentUserId,
          commentId: commentId,
          totalLikes: (like?.totalLikes || 0) + 1,
          id: like?.id || "",
          createdAt: like?.createdAt || new Date().toISOString(),
        };
        handleLikeToggle(newLike);
      }

      try {
        const result = await postLike(commentId);
        handleLikeToggle(result);
      } catch (error) {
        console.error("Error posting like:", error);
      } finally {
        setLoading(false);
      }
    });
  };

  return (
    <Button
      disabled={isPending}
      onClick={handleLike}
      className="flex items-center gap-1 transition-transform transform hover:scale-110 active:scale-125"
      size={"sm"}
      variant={"ghost"}
    >
      {loading ? (
        <LikeActionSkeleton />
      ) : (
        <>
          <ThumbsUp
            className={`transition-all duration-300 ${
              isLiked ? "fill-green-500" : "fill-transparent"
            }`}
            size={19}
          />
          <span className="transition-opacity duration-300 opacity-80">
            {like?.totalLikes}
          </span>
        </>
      )}
    </Button>
  );
};

export default LikeAction;

export const LikeActionSkeleton = () => {
  return <Skeleton className="w-6 h-6  bg-gray-500" />;
};
