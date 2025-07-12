// src/components/post/PostCard.tsx
import Link from "next/link";
import { PostListItem } from "@/types/PostListItem";

export default function PostCard({ post }: { post: PostListItem }) {
  return (
    <li className="border-b pb-3">
      <Link href={`/notice/${post.id}`}>
        <h2 className="text-lg font-semibold text-blue-600 hover:underline">{post.title}</h2>
      </Link>
      <div className="text-sm text-gray-500 mt-1">
        작성자: {post.authorNickname} · 댓글 {post.commentCount}
      </div>
    </li>
  );
}
