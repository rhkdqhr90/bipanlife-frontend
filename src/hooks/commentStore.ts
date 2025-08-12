import { PostComment } from "@/types/comment";
import { create } from "zustand";

interface CommentStore {
  comments: PostComment[];
  setComments: (comments: PostComment[]) => void;
}

export const useCommentStore = create<CommentStore>(set => ({
  comments: [],
  setComments: comments => set({ comments }),
}));
