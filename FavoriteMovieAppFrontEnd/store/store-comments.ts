import { IComment } from "@/types";
import { create } from "zustand";

interface ICommentsStore {
  comments: IComment[];
  setComments: (comments: IComment[]) => void;
  appendComment: (newComment: IComment) => void;
  appendComments: (newComments: IComment[]) => void;
}
export const useCommentsStore = create<ICommentsStore>((set) => ({
  comments: [],
  setComments: (comments) =>
    set(() => ({
      comments: comments,
    })),
  appendComment: (newComment) =>
    set((state) => {
      if (newComment.parentCommentId) {
        return {
          comments: state.comments.map((comment) =>
            comment.id === newComment.parentCommentId
              ? {
                  ...comment,
                  replyCount: comment.replyCount + 1,
                }
              : comment
          ),
        };
      } else {
        return {
          comments: [...state.comments, newComment],
        };
      }
    }),
  appendComments: (newComments) =>
    set((state) => ({
      comments: [...state.comments, ...newComments],
    })),
}));
