"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/apis/apiFetch";

interface ChatRoom {
  code: string;
  title: string;
  createdAt: string;
  expiredAt: string;
  closed: boolean;
}

interface Me {
  id: number;
  role: "ADMIN" | "CRITIC" | "USER" | "ANONYMOUS";
  nickName: string;
}

export default function DiscussionPage() {
  const [room, setRoom] = useState<ChatRoom | null>(null);
  const [me, setMe] = useState<Me | null>(null);
  const [title, setTitle] = useState("오늘의 토론방");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // 내 정보
    (async () => {
      try {
        const res = await apiFetch("/users/me", { credentials: "include" });
        if (res.ok) {
          const data = await res.json();
          setMe(data);
        } else {
          setMe(null);
        }
      } catch {
        setMe(null);
      }
    })();

    // 오늘의 채팅방
    (async () => {
      try {
        const res = await apiFetch("/api/chat/rooms/today");
        if (res.ok) {
          const data = await res.json();
          setRoom(data);
        }
      } catch {}
    })();
  }, []);

  const handleCreateRoom = async () => {
    if (!title.trim()) {
      alert("방 제목을 입력하세요.");
      return;
    }
    if (!confirm("채팅방을 생성하시겠습니까?")) return;

    try {
      setLoading(true);
      const res = await apiFetch(`/api/chat/rooms`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title }),
      });

      if (!res.ok) {
        const msg = await res.text();
        throw new Error(`방 생성 실패 (${res.status}) ${msg}`);
      }

      const data = await res.json();
      alert(`방 생성 완료: ${data.title} (code: ${data.code})`);
      router.push(`/discussion/${data.code}`);
    } catch (err) {
      alert("방 생성 실패: " + (err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleEnter = () => {
    if (room) router.push(`/chat/${room.code}`);
  };

  const isAdmin = me?.role === "ADMIN";

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">오늘의 실시간 토론방</h1>

      {isAdmin && !room && (
        <div className="mb-4 flex items-center gap-2">
          <input
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="방 제목을 입력하세요"
            className="border rounded px-3 py-2 w-64"
          />
          <button
            onClick={handleCreateRoom}
            disabled={loading}
            className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "생성 중..." : "채팅방 생성"}
          </button>
        </div>
      )}

      {room ? (
        <div className="border rounded-lg p-4 shadow-md">
          <p className="text-lg font-semibold">{room.title}</p>
          <button
            onClick={handleEnter}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            입장하기
          </button>
        </div>
      ) : (
        <p>채팅방 정보를 불러오는 중입니다...</p>
      )}
    </div>
  );
}
