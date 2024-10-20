"use client";
import { IComment } from "@/types";
import Comment, { CommentSkeleton } from "./comment";
import { Button } from "@/components/ui/button";
import { Dispatch, SetStateAction, useRef } from "react";
import { motion } from "framer-motion";
import { useLoadMoreComments } from "@/hooks/useLoadMoreComments";
import LoaderSpinner from "@/components/animated/loader-spinner";
import { limit } from "@/lib/constants";

type Props = {
  comments: IComment[];
  setComments: Dispatch<SetStateAction<IComment[] | []>>;
  postId: string;
  isReply: boolean;
  commentId?: string;
};

const Comments = ({
  comments: initialComments,
  setComments,
  postId,
  isReply,
  commentId,
}: Props) => {
  const { comments, loadMore, hasMore, loading } = useLoadMoreComments(
    postId,
    initialComments,
    setComments,
    1,
    limit,
    isReply,
    commentId
  );

  const ref = useRef<HTMLDivElement | null>(null);

  return (
    <div ref={ref} className="space-y-6 last:pb-4">
      {comments.map((comment, index) => (
        <motion.div
          key={comment.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: index * 0.1 }}
        >
          <Comment comment={comment} />
        </motion.div>
      ))}

      {hasMore && (
        <div className="flex items-center justify-center">
          <Button
            variant={"secondary"}
            size={"sm"}
            onClick={loadMore}
            disabled={loading}
            className={`transition-all duration-300 ${
              loading ? "opacity-50" : "opacity-100"
            }`}
          >
            {loading ? <LoaderSpinner className="h-5 w-5" /> : "Show More"}
          </Button>
        </div>
      )}
    </div>
  );
};

export default Comments;

export const CommentsSkeleton = () => {
  return (
    <div className="space-y-6 last:pb-4">
      {[...Array(5)].map((_, i) => (
        <CommentSkeleton key={i} />
      ))}
    </div>
  );
};
