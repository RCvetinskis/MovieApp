"use client";
import { getDislikeByCommentId, postDislike } from "@/actions/backend/dislike";
import { Button } from "@/components/ui/button";
import { useSetAuthorizedDialog } from "@/store/store";
import { IDislike } from "@/types";
import { ThumbsDown } from "lucide-react";
import { useEffect, useMemo, useState, useTransition } from "react";
import { LikeActionSkeleton } from "./like-action";

type Props = {
  commentId: string;
  currentUserId?: string;
  dislike: IDislike | null;
  setDislike: (dislike: IDislike | null) => void;
  handleDislikeToggle: (dislike: IDislike | null) => void;
};

const DislikeAction = ({
  commentId,
  currentUserId,
  dislike,
  setDislike,
  handleDislikeToggle,
}: Props) => {
  const [isPending, startTransition] = useTransition();
  const [loading, setLoading] = useState(false);
  const { setOpen } = useSetAuthorizedDialog();

  useEffect(() => {
    const getDislike = async () => {
      setLoading(true);
      try {
        const response = await getDislikeByCommentId(commentId);
        setDislike(response);
      } catch (error) {
        console.error("Error fetching dislike data:", error);
      } finally {
        setLoading(false);
      }
    };
    getDislike();
  }, [commentId]);

  const isDisliked = useMemo(() => {
    return currentUserId ? dislike?.userId === currentUserId : false;
  }, [currentUserId, dislike]);

  const handleDislike = () => {
    if (!currentUserId) {
      setOpen(true);
      return;
    }
    startTransition(async () => {
      setLoading(true);
      if (isDisliked) {
        handleDislikeToggle(null);
      } else {
        const newDislike: IDislike = {
          userId: currentUserId,
          commentId: commentId,
          totalDislikes: (dislike?.totalDislikes || 0) + 1,
          id: dislike?.id || "",
          createdAt: dislike?.createdAt || new Date().toISOString(),
        };
        handleDislikeToggle(newDislike);
      }
      try {
        const result = await postDislike(commentId);
        handleDislikeToggle(result);
      } catch (error) {
        console.error("Error posting dislike:", error);
      } finally {
        setLoading(false);
      }
    });
  };

  return (
    <Button
      disabled={isPending}
      onClick={handleDislike}
      className="flex items-center gap-1 transition-transform transform hover:scale-110 active:scale-125"
      size={"sm"}
      variant={"ghost"}
    >
      {loading ? (
        <LikeActionSkeleton />
      ) : (
        <>
          <ThumbsDown
            className={`transition-all duration-300 ${
              isDisliked ? "fill-red-500" : "fill-transparent"
            }`}
            size={19}
          />
          <span className="transition-opacity duration-300 opacity-80">
            {dislike?.totalDislikes}
          </span>
        </>
      )}
    </Button>
  );
};

export default DislikeAction;
