import { CommentFormProps, EditCommentFormProps } from "@/types/comment";

export function isEditMode(props: CommentFormProps): props is EditCommentFormProps {
  return props.mode === "edit";
}
