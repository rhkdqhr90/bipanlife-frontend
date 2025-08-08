/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
interface ChatRoom {
  code: string; // ✅ 여기
  title: string;
  createdAt: string;
  expiredAt: string;
  closed: boolean;
}

export default function DiscussionPage() {
  const [room, setRoom] = useState<ChatRoom | null>(null);
  const router = useRouter();
  const [userId, setUserId] = useState<number>(1);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // ✅ 오늘의 채팅방 정보 가져오기
    const fetchRoom = async () => {
      try {
        const res = await fetch("/api/chat/rooms/today");
        if (!res.ok) throw new Error("채팅방 정보를 불러올 수 없습니다.");
        const data = await res.json();

        setRoom(data);
      } catch (e) {
        console.error(e);
      }
    };

    fetchRoom();
  }, []);

  const handleCreateRoom = async () => {
    if (!window.confirm("채팅방을 생성하시겠습니까?")) return;

    try {
      setLoading(true);
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/chat/rooms`, {
        method: "POST",
        credentials: "include", // ✅ 쿠키 자동 포함
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: "오늘의 토론방",
        }),
      });

      if (!res.ok) {
        throw new Error(`방 생성 실패 (${res.status})`);
      }

      const data = await res.json();
      alert(`방 생성 완료: ${data.title} (code: ${data.code})`);
      // ✅ 이동도 가능
      window.location.href = `/discussion/${data.code}`;
    } catch (err) {
      alert("방 생성 실패: " + (err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  if (userId !== 1) return null;

  const handleEnter = () => {
    if (room) {
      console.log(`${room.code}`);
      router.push(`/chat/${room.code}`);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">오늘의 실시간 토론방</h1>
      {userId === 1 && !room && (
        <button
          onClick={handleCreateRoom}
          className="mb-4 px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
        >
          채팅방 생성
        </button>
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
