"use client";
import { IComment, ICommentsResponse } from "@/types";
import CommentInput, { CommentInputSkeleton } from "./comment-input";
import Comments, { CommentsSkeleton } from "./displayed-comments/comments";
import { useLayoutEffect, useState } from "react";
import useWebSocket from "@/hooks/use-web-hook";
import { Skeleton } from "@/components/ui/skeleton";

type Props = {
  comments: ICommentsResponse | null;
  postId: string;
};

const CommentsContainer = ({ comments, postId }: Props) => {
  const [initialComments, setInitialComments] = useState<IComment[]>(
    comments?.response.comments || []
  );
  const [totalComments, setTotalComments] = useState<number>(
    comments?.response.totalComments ?? 0
  );

  const handleWebSocketMessage = (newComment: IComment) => {
    setTotalComments((prev) => prev + 1);
    setInitialComments((prevComments) => [newComment, ...prevComments]);
  };

  useWebSocket(
    `${process.env.NEXT_PUBLIC_BACKEND_WS_URL}/comment/post/${postId}`,
    handleWebSocketMessage
  );

  const [isMounted, setIsMounted] = useState(false);
  useLayoutEffect(() => {
    setIsMounted(true);
  }, []);
  if (!isMounted) return <CommentsContainerSkeleton />;

  return (
    <div className="space-y-4 ">
      <CommentInput postId={postId} className="h-32" />

      <div className="p-6 space-y-4 rounded-lg shadow-lg  dark:shadow-black shadow-primary ">
        <header>
          <p className="space-x-1 ">
            <span> {totalComments}</span>
            <span>Comments</span>
          </p>
        </header>

        {initialComments.length > 0 && (
          <Comments
            comments={initialComments}
            setComments={setInitialComments}
            postId={postId}
            isReply={false}
          />
        )}
      </div>
    </div>
  );
};

export default CommentsContainer;

export const CommentsContainerSkeleton = () => {
  return (
    <div className="space-y-4">
      <CommentInputSkeleton />

      <div className="p-6 space-y-4 rounded-lg shadow-lg  dark:shadow-black shadow-primary ">
        <header>
          <Skeleton className="bg-gray-500 w-12 h-4" />
        </header>
        <CommentsSkeleton />
      </div>
    </div>
  );
};
