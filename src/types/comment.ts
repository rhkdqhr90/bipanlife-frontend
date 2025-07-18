// 📄 types/comment.ts
export interface PostComment {
  id: number;
  parentId: number | null;
  authorNickName: string;
  content: string;
  likeCount: number;
  dislikeCount: number;
  reportCount: number;
  isBlinded: boolean;
  isDeleted: boolean;
  createdAt: string;
  depth: number; // ✅ 추가됨 (1: 댓글, 2: 대댓글 이상)
}

interface CommentFormBaseProps {
  onDone?: () => void;
}

interface CreateCommentFormProps extends CommentFormBaseProps {
  mode: "create";
  postId: number;
  parentId?: number;
  onSubmit: (content: string, parentId?: number) => void;
}

export interface EditCommentFormProps extends CommentFormBaseProps {
  mode: "edit";
  comment: PostComment;
  onSubmit: (content: string) => void;
}

export type CommentFormProps = CreateCommentFormProps | EditCommentFormProps;
