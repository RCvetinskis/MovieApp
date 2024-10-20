import { IMockLikes } from "@/types";

const mockLikes: IMockLikes[] = [
  {
    likes: ["2fc2bea4-caf4-4089-be2e-afcf261c206c"],
    likesCount: 1,
    dislikes: [],
    dislikesCount: 0,
    commentId: "465645",
  },
  {
    likes: [],
    likesCount: 0,
    dislikes: ["2fc2bea4-caf4-4089-be2e-afcf261c206c"],
    dislikesCount: 1,
    commentId: "534534",
  },
  {
    likes: [],
    likesCount: 0,
    dislikes: ["2fc2bea4-caf4-4089-be2e-afcf261c206c"],
    dislikesCount: 1,
    commentId: "342142",
  },
  {
    likes: [],
    likesCount: 0,
    dislikes: ["2fc2bea4-caf4-4089-be2e-afcf261c206c"],
    dislikesCount: 1,
    commentId: "543534",
  },
];

export const getLikeByCommentId = async (commentId: string) => {
  const result = mockLikes.find((item) => item.commentId === commentId);
  if (!result) return null;

  return result;
};

export const handleLikeDislike = async (
  commentId: string,
  userId: string,
  type: "like" | "dislike"
) => {
  const comment = await getLikeByCommentId(commentId);

  if (!comment) return null;

  if (type === "like") {
    if (comment.likes.includes(userId)) {
      comment.likes = comment.likes.filter((id) => id !== userId);
      comment.likesCount--;
    } else {
      comment.dislikes = comment.dislikes.filter((id) => id !== userId);
      comment.dislikesCount = comment.dislikes.length;

      // Add user to likes
      comment.likes.push(userId);
      comment.likesCount++;
    }
  }

  if (type === "dislike") {
    if (comment.dislikes.includes(userId)) {
      // If user already disliked, remove the dislike
      comment.dislikes = comment.dislikes.filter((id) => id !== userId);
      comment.dislikesCount--;
    } else {
      // If user is liking, remove the like
      comment.likes = comment.likes.filter((id) => id !== userId);
      comment.likesCount = comment.likes.length;

      // Add user to dislikes
      comment.dislikes.push(userId);
      comment.dislikesCount++;
    }
  }
  return { ...comment };
};
