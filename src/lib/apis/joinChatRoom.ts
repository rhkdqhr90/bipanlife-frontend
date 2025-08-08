// src/api/chat/joinChatRoom.ts
export async function joinChatRoom(roomCode: string, userId: number): Promise<void> {
  try {
    const res = await fetch(`/api/chat/rooms/${roomCode}/join?userId=${userId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include", // 🍪 쿠키 기반 인증 시 필수
      body: JSON.stringify({ roomCode }),
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || "입장 실패");
    }

    console.log("✅ 채팅방 입장 완료");
  } catch (err) {
    console.error("❌ 채팅방 입장 오류:", err);
    throw err;
  }
}
