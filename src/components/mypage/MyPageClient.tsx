// components/mypage/MyPageClient.tsx
"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  getMyProfile,
  getMyPosts,
  getMyComments,
  updateMyProfile,
  deleteMyAccount,
  checkNicknameDuplicate,
} from "@/lib/apis/user";

interface Post {
  postId: number;
  boardCode: string;
  title: string;
  createdAt: string;
}

interface Comment {
  commentId: number;
  content: string;
  createdAt: string;
  postTitle: string;
}

export default function MyPageClient() {
  const router = useRouter();
  const [nickname, setNickname] = useState("");
  const [editingNickname, setEditingNickname] = useState("");
  const [posts, setPosts] = useState<Post[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [bio, setBio] = useState("");
  const [editingBio, setEditingBio] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState<"posts" | "comments">("posts");

  const handleProfileUpdate = async () => {
    const hasNicknameChanged = editingNickname !== nickname;
    const hasBioChanged = editingBio !== bio;

    if (!hasNicknameChanged && !hasBioChanged) {
      alert("변경된 내용이 없습니다.");
      return;
    }

    try {
      if (hasNicknameChanged) {
        const isDuplicate = await checkNicknameDuplicate(editingNickname);
        if (isDuplicate) {
          alert("이미 사용 중인 닉네임입니다.");
          return;
        }
      }

      await updateMyProfile({
        nickname: editingNickname,
        bio: editingBio,
      });

      if (hasNicknameChanged) setNickname(editingNickname);
      if (hasBioChanged) setBio(editingBio);

      setIsEditing(false);
      alert("프로필이 변경되었습니다.");
    } catch {
      alert("프로필 변경에 실패했습니다.");
    }
  };

  const handleCancelEdit = () => {
    setEditingNickname(nickname);
    setEditingBio(bio);
    setIsEditing(false);
  };

  const handleDeleteAccount = async () => {
    const confirmDelete = confirm("정말 탈퇴하시겠습니까?");
    if (!confirmDelete) return;

    try {
      await deleteMyAccount();
      alert("탈퇴 처리되었습니다.");
      router.push("/");
    } catch {
      alert("탈퇴에 실패했습니다.");
    }
  };

  useEffect(() => {
    getMyProfile()
      .then(data => {
        setNickname(data.nickname);
        setEditingNickname(data.nickname);
        setBio(data.bio);
        setEditingBio(data.bio);
      })
      .catch(() => alert("내 정보를 불러오지 못했습니다."));
  }, []);

  useEffect(() => {
    getMyPosts(0, 10)
      .then(data => setPosts(data))
      .catch(() => alert("내 게시글 목록 불러오기 실패"));
  }, []);

  useEffect(() => {
    getMyComments(0, 10)
      .then(data => setComments(data))
      .catch(() => alert("내 댓글 목록 불러오기 실패"));
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-6xl mx-auto p-6">
        {/* 헤더 */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">마이페이지</h1>
          <p className="text-gray-600">내 정보를 관리하고 활동 내역을 확인하세요</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 왼쪽: 프로필 카드 */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
              {/* 프로필 헤더 */}
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 h-32 relative">
                <div className="absolute inset-x-0 bottom-0 transform translate-y-1/2">
                  <div className="flex justify-center">
                    <div className="w-24 h-24 bg-white rounded-full border-4 border-white shadow-lg flex items-center justify-center">
                      <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-2xl font-bold">
                          {nickname.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 프로필 정보 */}
              <div className="pt-16 pb-6 px-6">
                {!isEditing ? (
                  <div className="text-center space-y-4">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-800">{nickname}</h2>
                      <p className="text-gray-600 mt-2 leading-relaxed">
                        {bio || "아직 소개글이 없습니다."}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mt-6">
                      <div className="text-center p-3 bg-blue-50 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">{posts.length}</div>
                        <div className="text-sm text-gray-600">작성한 글</div>
                      </div>
                      <div className="text-center p-3 bg-purple-50 rounded-lg">
                        <div className="text-2xl font-bold text-purple-600">{comments.length}</div>
                        <div className="text-sm text-gray-600">작성한 댓글</div>
                      </div>
                    </div>

                    <button
                      onClick={() => setIsEditing(true)}
                      className="w-full mt-6 bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-200 shadow-md hover:shadow-lg"
                    >
                      프로필 수정
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <h3 className="text-xl font-bold text-center text-gray-800 mb-6">
                      프로필 수정
                    </h3>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">닉네임</label>
                      <input
                        value={editingNickname}
                        onChange={e => setEditingNickname(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        placeholder="닉네임을 입력하세요"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">소개글</label>
                      <textarea
                        value={editingBio}
                        onChange={e => setEditingBio(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
                        rows={4}
                        placeholder="자기 소개를 입력하세요"
                      />
                    </div>

                    <div className="flex gap-3 mt-6">
                      <button
                        onClick={handleProfileUpdate}
                        className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-200"
                      >
                        저장
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        className="flex-1 bg-gray-500 text-white py-3 rounded-lg font-semibold hover:bg-gray-600 transition-all duration-200"
                      >
                        취소
                      </button>
                    </div>
                  </div>
                )}

                {/* 회원 탈퇴 */}
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <button
                    onClick={handleDeleteAccount}
                    className="w-full text-red-600 hover:text-red-700 text-sm font-medium py-2 hover:bg-red-50 rounded-lg transition-all duration-200"
                  >
                    회원 탈퇴
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* 오른쪽: 활동 내역 */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
              {/* 탭 헤더 */}
              <div className="border-b border-gray-200">
                <div className="flex">
                  <button
                    onClick={() => setActiveTab("posts")}
                    className={`flex-1 py-4 px-6 font-medium text-center transition-all duration-200 ${
                      activeTab === "posts"
                        ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50"
                        : "text-gray-600 hover:text-gray-800 hover:bg-gray-50"
                    }`}
                  >
                    <span className="flex items-center justify-center gap-2">
                      📄 내가 쓴 글 ({posts.length})
                    </span>
                  </button>
                  <button
                    onClick={() => setActiveTab("comments")}
                    className={`flex-1 py-4 px-6 font-medium text-center transition-all duration-200 ${
                      activeTab === "comments"
                        ? "text-purple-600 border-b-2 border-purple-600 bg-purple-50"
                        : "text-gray-600 hover:text-gray-800 hover:bg-gray-50"
                    }`}
                  >
                    <span className="flex items-center justify-center gap-2">
                      💬 내가 쓴 댓글 ({comments.length})
                    </span>
                  </button>
                </div>
              </div>

              {/* 탭 콘텐츠 */}
              <div className="p-6">
                {activeTab === "posts" ? (
                  <div className="space-y-4">
                    {posts.length === 0 ? (
                      <div className="text-center py-12">
                        <div className="text-4xl mb-4">📝</div>
                        <p className="text-gray-500">아직 작성한 글이 없습니다.</p>
                      </div>
                    ) : (
                      posts.map(post => (
                        <div
                          key={post.postId}
                          className="group bg-gray-50 hover:bg-blue-50 rounded-xl p-5 transition-all duration-200 border border-transparent hover:border-blue-200 cursor-pointer"
                          onClick={() => router.push(`/${post.boardCode}/${post.postId}`)}
                        >
                          <div className="flex justify-between items-start gap-4">
                            <div className="flex-1 min-w-0">
                              <h3 className="text-lg font-semibold text-gray-800 group-hover:text-blue-600 transition-colors duration-200 truncate">
                                {post.title}
                              </h3>
                              <div className="flex items-center gap-3 mt-2 text-sm text-gray-500">
                                <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs font-medium">
                                  {post.boardCode}
                                </span>
                                <span>{post.createdAt}</span>
                              </div>
                            </div>
                            <div className="text-gray-400 group-hover:text-blue-400 transition-colors duration-200">
                              →
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {comments.length === 0 ? (
                      <div className="text-center py-12">
                        <div className="text-4xl mb-4">💭</div>
                        <p className="text-gray-500">아직 작성한 댓글이 없습니다.</p>
                      </div>
                    ) : (
                      comments.map(comment => (
                        <div
                          key={comment.commentId}
                          className="bg-gray-50 hover:bg-purple-50 rounded-xl p-5 transition-all duration-200 border border-transparent hover:border-purple-200"
                        >
                          <div className="mb-3">
                            <p className="text-gray-800 leading-relaxed">{comment.content}</p>
                          </div>
                          <div className="flex justify-between items-center text-sm text-gray-500">
                            <span className="flex items-center gap-2">
                              <span className="font-medium">게시글:</span>
                              <span className="text-purple-600 font-medium">
                                {comment.postTitle}
                              </span>
                            </span>
                            <span>{comment.createdAt}</span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
