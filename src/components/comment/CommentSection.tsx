// 📄 components/comment/CommentSection.tsx
"use client";

import { useEffect, useState } from "react";
import { CommentForm } from "./CommentForm";
import { CommentList } from "./CommentList";
import { PostComment } from "@/types/comment";
import { fetchComments, postComment, updateComment, deleteComment } from "@/lib/apis/comments";
import { useUserStore } from "@/stores/userStore";

interface CommentSectionProps {
  postId: number;
}

export const CommentSection = ({ postId }: CommentSectionProps) => {
  const [comments, setComments] = useState<PostComment[]>([]);
  const [loading, setLoading] = useState(true);
  const userInfo = useUserStore(state => state.userInfo);

  const loadComments = async () => {
    try {
      setLoading(true);
      const data = await fetchComments(postId);
      setComments(data);
    } catch (err) {
      console.error("댓글 불러오기 실패", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadComments();
  }, [postId]);

  const handleAddComment = async (content: string, parentId?: number) => {
    try {
      if (!userInfo) {
        alert("댓글을 작성하려면 로그인해야 합니다.");
        return;
      }

      if (content.trim().length === 0) {
        alert("내용을 입력해주세요.");
        return;
      }
      await postComment(postId, content, parentId);
      await loadComments();
    } catch (err) {
      console.error("댓글 작성 실패", err);
    }
  };

  const handleUpdateComment = async (commentId: number, content: string) => {
    try {
      await updateComment(commentId, content);
      await loadComments();
    } catch (err) {
      console.error("댓글 수정 실패", err);
    }
  };

  const handleDeleteComment = async (commentId: number) => {
    try {
      await deleteComment(commentId);
      await loadComments();
    } catch (err) {
      console.error("댓글 삭제 실패", err);
    }
  };

  return (
    <section>
      <h2 className="text-lg font-semibold mb-4">댓글</h2>
      <CommentForm postId={postId} mode="create" onSubmit={handleAddComment} />
      <div className="mt-6">
        {loading ? (
          <p>댓글 불러오는 중...</p>
        ) : (
          <CommentList
            postId={postId}
            comments={comments}
            onUpdate={handleUpdateComment}
            onDelete={handleDeleteComment}
            onReply={handleAddComment}
          />
        )}
      </div>
    </section>
  );
};
