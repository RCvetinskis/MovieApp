import { useState } from "react";
import DislikeAction from "./dislike-action";
import LikeAction, { LikeActionSkeleton } from "./like-action";
import { IDislike, ILike } from "@/types";

type Props = {
  commentId: string;
  currentUserId?: string;
};

const LikeDislikeComment = ({ commentId, currentUserId }: Props) => {
  const [like, setLike] = useState<ILike | null>(null);
  const [dislike, setDislike] = useState<IDislike | null>(null);
  const handleLikeToggle = (newLike: ILike | null) => {
    setLike(newLike);
    if (newLike) setDislike(null);
  };

  const handleDislikeToggle = (newDislike: IDislike | null) => {
    setDislike(newDislike);
    if (newDislike) setLike(null);
  };
  return (
    <div className="flex items-center gap-1">
      <LikeAction
        commentId={commentId}
        currentUserId={currentUserId}
        like={like}
        setLike={setLike}
        handleLikeToggle={handleLikeToggle}
      />
      <DislikeAction
        commentId={commentId}
        currentUserId={currentUserId}
        dislike={dislike}
        setDislike={setDislike}
        handleDislikeToggle={handleDislikeToggle}
      />
    </div>
  );
};

export default LikeDislikeComment;

export const LikeDislikeCommentSkeleton = () => {
  return (
    <div className="flex items-center gap-1 w-full">
      <LikeActionSkeleton />
      <LikeActionSkeleton />
    </div>
  );
};
