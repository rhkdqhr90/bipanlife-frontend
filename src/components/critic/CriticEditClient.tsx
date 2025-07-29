"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { TiptapEditor } from "@/components/editor/TiptapEditor";
import { KakaoMapViewer } from "@/components/map/KakaoMapViewer";
import { StarRatingInput } from "@/components/rating/StarRatingInput";
import { TagInput } from "@/components/tag/TagInput";
import { updatePost, getCriticPostDetail } from "@/lib/apis/posts";
import { PostDetail } from "@/types/PostListItem";

interface Props {
  postId: string;
  boardCode: string;
}

export default function CriticEditClient({ postId, boardCode }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [post, setPost] = useState<PostDetail | null>(null);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [ratings, setRatings] = useState<
    { name: string; score: number; type: "positive" | "negative" }[]
  >([]);
  const [location, setLocation] = useState<{
    placeName: string;
    address: string;
    latitude: number;
    longitude: number;
  } | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const data = await getCriticPostDetail(postId);
        setPost(data);
        setTitle(data.title);
        setContent(data.content);
        setTags(data.tags);
        setRatings(data.ratings);
        if (data.placeName) {
          setLocation({
            placeName: data.placeName || "",
            address: data.address || "",
            latitude: Number(data.latitude),
            longitude: Number(data.longitude),
          });
        }
      } catch (err) {
        console.error("게시글 불러오기 실패:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, [postId]);

  const handleSubmit = async () => {
    try {
      await updatePost(Number(postId), {
        title,
        content,
        tags,
        ratings,
        ...(location && {
          placeName: location.placeName,
          address: location.address,
          latitude: location.latitude,
          longitude: location.longitude,
        }),
      });
      router.push(`/critic/${boardCode}`);
    } catch (err) {
      console.error("게시글 수정 실패:", err);
    }
  };

  if (loading || !post) return <div>로딩 중...</div>;

  return (
    // 기존 렌더링 그대로 복붙
    <div className="bg-gray-50 min-h-screen py-16 px-6 sm:px-10 lg:px-16">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md border border-gray-200 px-8 py-10">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">비판글 수정</h1>
        <input
          type="text"
          placeholder="제목을 입력하세요"
          value={title}
          onChange={e => setTitle(e.target.value)}
          className="w-full text-2xl font-semibold border-b border-gray-300 focus:outline-none focus:border-blue-500 pb-3 mb-8 bg-transparent"
        />
        <StarRatingInput ratingItems={ratings} setRatingItems={setRatings} />
        <div className="max-w-full">
          <div className="p-8 prose prose-sm sm:prose lg:prose-lg xl:prose-xl max-w-full ml-14">
            <TagInput tags={tags} setTags={setTags} />
            <div className="mt-10">
              <TiptapEditor
                content={content}
                onChange={setContent}
                onSelectLocation={setLocation}
              />
            </div>
            {location && (
              <div className="mt-10">
                <KakaoMapViewer {...location} />
              </div>
            )}
            <div className="flex justify-end mt-10">
              <button
                onClick={handleSubmit}
                className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 font-semibold"
              >
                수정 완료
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
