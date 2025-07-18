// 📄 components/comment/CommentList.tsx

import { PostComment } from "@/types/comment";
import { formatDateTime } from "@/utils/data";

interface CommentListProps {
  comments: PostComment[];
}

export const CommentList = ({ comments }: CommentListProps) => {
  const renderComments = (parentId: number | null = null, depth = 0) => {
    return comments
      .filter(comment => comment.parentId === parentId)
      .map(comment => (
        <div key={comment.id} className={`ml-${depth * 4} border-l pl-4 py-2`}>
          <div className="text-sm font-semibold">{comment.authorNickName}</div>
          <div className="text-gray-800">{comment.content}</div>
          <div className="text-xs text-gray-500 flex justify-between">
            <span>{formatDateTime(comment.createdAt)}</span>
            <span>
              👍 {comment.likeCount} 👎 {comment.dislikeCount}
            </span>
          </div>
          {/* 대댓글 렌더링 */}
          {depth < 1 && renderComments(comment.id, depth + 1)}
        </div>
      ));
  };
  return <div>{renderComments()}</div>;
};
