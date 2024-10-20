"use client";
import LikeDislikeComment, {
  LikeDislikeCommentSkeleton,
} from "./likes-dislikes/like-dislike-comment";
import ReplyCommentAciton, {
  ReplyCommentActionSkeleton,
} from "./reply-comment-action";
import DisplayRepliesAction, {
  DisplayRepliesActionSkeleton,
} from "./display-replies-action";
import useGetUserCookie from "@/hooks/use-get-user-cookie";

type Props = {
  commentId: string;
};

const CommentActionsContainer = ({ commentId }: Props) => {
  const { userId } = useGetUserCookie();

  return (
    <div className="space-y-2">
      <LikeDislikeComment currentUserId={userId} commentId={commentId} />

      <ReplyCommentAciton commentId={commentId} />

      <DisplayRepliesAction commentId={commentId} />
    </div>
  );
};

export default CommentActionsContainer;

export const CommentActionsContainerSkeleton = () => {
  return (
    <div className="space-y-2">
      <LikeDislikeCommentSkeleton />
      <ReplyCommentActionSkeleton />

      <DisplayRepliesActionSkeleton />
    </div>
  );
};
