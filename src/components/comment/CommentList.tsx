"use client";

import { useState } from "react";
import { PostComment } from "@/types/comment";
import { CommentForm } from "./CommentForm";
import clsx from "clsx";
import { useUserStore } from "@/stores/userStore";

interface CommentListProps {
  postId: number;
  comments: PostComment[];
  onUpdate: (commentId: number, content: string) => void;
  onDelete: (commentId: number) => void;
  onReply: (content: string, parentId?: number) => void;
}

// Enhanced color palette for avatars
const getAvatarColor = (name: string) => {
  let hash = 0;
  if (name.length === 0) return "bg-slate-200 text-slate-700";
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
    hash = hash & hash;
  }
  const colors = [
    "bg-gradient-to-br from-rose-400 to-rose-600 text-white",
    "bg-gradient-to-br from-blue-400 to-blue-600 text-white",
    "bg-gradient-to-br from-emerald-400 to-emerald-600 text-white",
    "bg-gradient-to-br from-amber-400 to-amber-600 text-white",
    "bg-gradient-to-br from-purple-400 to-purple-600 text-white",
    "bg-gradient-to-br from-pink-400 to-pink-600 text-white",
    "bg-gradient-to-br from-indigo-400 to-indigo-600 text-white",
    "bg-gradient-to-br from-teal-400 to-teal-600 text-white",
    "bg-gradient-to-br from-orange-400 to-orange-600 text-white",
    "bg-gradient-to-br from-cyan-400 to-cyan-600 text-white",
  ];
  const index = Math.abs(hash) % colors.length;
  return colors[index];
};

export const CommentList = ({
  postId,
  comments,
  onUpdate,
  onDelete,
  onReply,
}: CommentListProps) => {
  const [editingId, setEditingId] = useState<number | null>(null);
  const [replyToId, setReplyToId] = useState<number | null>(null);
  const userInfo = useUserStore(state => state.userInfo);

  const topLevel = comments.filter(c => c.depth === 1);
  const childrenMap = comments.reduce(
    (acc, comment) => {
      if (comment.depth > 1 && comment.parentId) {
        acc[comment.parentId] = acc[comment.parentId] || [];
        acc[comment.parentId].push(comment);
      }
      return acc;
    },
    {} as Record<number, PostComment[]>,
  );

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
      <div className="p-6 space-y-6">
        {topLevel.map((comment, index) => {
          const isAuthor = userInfo?.id === comment.authorId;
          console.log(userInfo);
          return (
            <div
              key={comment.id}
              className={clsx("group", { "border-t border-gray-100 pt-6": index > 0 })}
            >
              <div className="flex space-x-4">
                {editingId === comment.id ? (
                  <div className="flex-grow">
                    <CommentForm
                      mode="edit"
                      comment={comment}
                      onSubmit={content => {
                        onUpdate(comment.id, content);
                        setEditingId(null);
                      }}
                    />
                  </div>
                ) : (
                  <>
                    <div
                      className={clsx(
                        "flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shadow-md ring-2 ring-white",
                        getAvatarColor(comment.authorNickName),
                      )}
                    >
                      {comment.authorNickName.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-grow min-w-0">
                      <div className="flex justify-between items-start">
                        <div className="flex-grow">
                          <div className="flex items-center space-x-2">
                            <span className="font-semibold text-gray-900 text-sm">
                              {comment.authorNickName}
                            </span>
                          </div>
                          <span className="text-gray-500 text-xs">
                            {new Date(comment.createdAt).toLocaleString("ko-KR", {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <button
                            onClick={() =>
                              setReplyToId(replyToId === comment.id ? null : comment.id)
                            }
                            className={clsx(
                              "text-xs font-medium px-3 py-1.5 rounded-full",
                              replyToId === comment.id
                                ? "bg-gray-700 text-white"
                                : "text-blue-600 hover:text-blue-800 hover:bg-blue-50 border border-blue-200 hover:border-blue-300",
                            )}
                          >
                            {replyToId === comment.id ? "취소" : "답글"}
                          </button>
                          {isAuthor && (
                            <>
                              <button
                                onClick={() => setEditingId(comment.id)}
                                className="px-3 py-1.5 text-xs font-medium text-green-600 hover:text-green-800 hover:bg-green-50 rounded-full border border-green-200 hover:border-green-300"
                              >
                                수정
                              </button>
                              <button
                                onClick={() => onDelete(comment.id)}
                                className="px-3 py-1.5 text-xs font-medium text-red-600 hover:text-red-800 hover:bg-red-50 rounded-full border border-red-200 hover:border-red-300"
                              >
                                삭제
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                      <div className="mt-3 p-4 bg-gray-50 rounded-xl border border-gray-100">
                        <p className="text-gray-800 text-sm leading-relaxed whitespace-pre-wrap">
                          {comment.content}
                        </p>
                      </div>
                    </div>
                  </>
                )}
              </div>

              {childrenMap[comment.id]?.map(child => {
                const isChildAuthor = userInfo?.id === child.authorId;
                return (
                  <div key={child.id} className="ml-14 mt-4 relative">
                    <div className="absolute -left-6 top-6 h-[calc(100%-1.5rem)] w-0.5 bg-gradient-to-b from-gray-300 via-gray-200 to-transparent" />
                    <div className="absolute -left-7 top-6 w-2 h-2 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full border-2 border-white shadow-sm" />
                    <div className="flex space-x-4">
                      {editingId === child.id ? (
                        <div className="flex-grow">
                          <CommentForm
                            mode="edit"
                            comment={child}
                            onSubmit={content => {
                              onUpdate(child.id, content);
                              setEditingId(null);
                            }}
                          />
                        </div>
                      ) : (
                        <>
                          <div
                            className={clsx(
                              "flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shadow-md ring-2 ring-white",
                              getAvatarColor(child.authorNickName),
                            )}
                          >
                            {child.authorNickName.charAt(0).toUpperCase()}
                          </div>
                          <div className="flex-grow min-w-0">
                            <div className="flex justify-between items-start">
                              <div className="flex-grow">
                                <div className="flex items-center space-x-2">
                                  <span className="font-medium text-gray-900 text-sm">
                                    {child.authorNickName}
                                  </span>
                                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                    답글
                                  </span>
                                </div>
                                <span className="text-gray-500 text-xs">
                                  {new Date(child.createdAt).toLocaleString("ko-KR", {
                                    year: "numeric",
                                    month: "short",
                                    day: "numeric",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  })}
                                </span>
                              </div>
                              <div className="flex items-center space-x-1">
                                {isChildAuthor && (
                                  <>
                                    <button
                                      onClick={() => setEditingId(child.id)}
                                      className="px-2 py-1 text-xs font-medium text-green-600 hover:text-green-800 hover:bg-green-50 rounded-md border border-green-200 hover:border-green-300"
                                    >
                                      수정
                                    </button>
                                    <button
                                      onClick={() => onDelete(child.id)}
                                      className="px-2 py-1 text-xs font-medium text-red-600 hover:text-red-800 hover:bg-red-50 rounded-md border border-red-200 hover:border-red-300"
                                    >
                                      삭제
                                    </button>
                                  </>
                                )}
                              </div>
                            </div>
                            <div className="mt-3 p-4 bg-gray-50 rounded-xl border border-gray-100">
                              <p className="text-gray-800 text-sm leading-relaxed whitespace-pre-wrap">
                                {child.content}
                              </p>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                );
              })}

              {replyToId === comment.id && (
                <div className="mt-6 ml-14 p-4 bg-blue-50 rounded-xl border border-blue-200">
                  <div className="flex items-center space-x-2 mb-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-sm font-medium text-blue-700">
                      {comment.authorNickName}님에게 답글 작성
                    </span>
                  </div>
                  <CommentForm
                    mode="create"
                    postId={postId}
                    parentId={comment.id}
                    onSubmit={content => {
                      onReply(content, comment.id);
                      setReplyToId(null);
                    }}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
