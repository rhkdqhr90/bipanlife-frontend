"use client";

import { useEffect, useState } from "react";

import type { CommentFormProps } from "@/types/comment";

export const CommentForm = (props: CommentFormProps) => {
  const [content, setContent] = useState("");

  useEffect(() => {
    if (props.mode === "edit") {
      setContent(props.comment.content);
    }
  }, [props]);

  const handleSubmit = () => {
    if (!content.trim()) return;

    if (props.mode === "edit") {
      props.onSubmit(content);
    } else {
      props.onSubmit(content, props.parentId);
    }

    setContent("");
    props.onDone?.();
  };

  return (
    <div className="space-y-2">
      <textarea
        className="w-full border border-gray-300 rounded-lg p-3 text-sm"
        rows={4}
        value={content}
        onChange={e => setContent(e.target.value)}
        placeholder="댓글을 입력하세요"
      />
      <div className="text-right">
        <button
          onClick={handleSubmit}
          disabled={content.trim() === ""}
          className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-700 disabled:bg-gray-300"
        >
          {props.mode === "edit" ? "수정 완료" : "댓글 작성"}
        </button>
      </div>
    </div>
  );
};
