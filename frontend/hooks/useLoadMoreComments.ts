import { useState, useCallback, Dispatch, SetStateAction } from "react";
import { IComment } from "@/types";
import { getCommentsByPostId } from "@/actions/backend/comment-server";
import { getReplies } from "@/actions/backend/comment";

export const useLoadMoreComments = (
  postId: string,
  comments: IComment[],
  setComments: Dispatch<SetStateAction<IComment[] | []>>,
  initialPage = 1,
  limit = 1,
  isReply: boolean,
  commentId?: string
) => {
  const [currentPage, setCurrentPage] = useState<number>(initialPage);
  const [hasMore, setHasMore] = useState<boolean>(comments.length === limit);
  const [loading, setLoading] = useState<boolean>(false);

  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    const nextPage = currentPage + 1;

    try {
      const response =
        isReply && commentId
          ? await getReplies(commentId, nextPage, limit)
          : await getCommentsByPostId(postId, nextPage, limit);

      if (response?.response) {
        const { comments: newComments, totalComments } = response.response;

        setComments((prevComments) => [...prevComments, ...newComments]);
        setCurrentPage(nextPage);

        // Check if there are more comments to load
        setHasMore(
          newComments.length === limit &&
            comments.length + newComments.length < totalComments
        );
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error("Error loading more comments:", error);
    } finally {
      setLoading(false);
    }
  }, [loading, hasMore, currentPage, postId, limit, isReply, commentId]);

  return {
    comments,
    loadMore,
    hasMore,
    loading,
  };
};
