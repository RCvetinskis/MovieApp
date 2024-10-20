"use client";
import { cn } from "@/lib/utils";
import { IComment } from "@/types";
import UserInfo, { UserInfoSkeleton } from "./user-info";
import CommentActionsContainer, {
  CommentActionsContainerSkeleton,
} from "./comment-actions/comment-actions-container";
import { Skeleton } from "@/components/ui/skeleton";

type Props = {
  comment: IComment;
  className?: string;
};

const Comment = ({ comment, className }: Props) => {
  return (
    <div className={cn("flex items-center gap-2 rounded-lg", className)}>
      <div className="w-full space-y-2">
        {/* user info */}
        <UserInfo userId={comment.userId} createdAt={comment.createdAt} />

        {/* comment and comment actions */}

        <p className="text-primary/90 max-h-[100px] overflow-x-auto">
          {comment.message}
        </p>

        <CommentActionsContainer commentId={comment.id} />
      </div>
    </div>
  );
};

export default Comment;

export const CommentSkeleton = () => {
  return (
    <div className="flex items-center gap-2 rounded-lg">
      <div className="w-full space-y-2">
        <UserInfoSkeleton />
        <Skeleton className="w-40 h-4 bg-gray-500" />
        <CommentActionsContainerSkeleton />
      </div>
    </div>
  );
};
