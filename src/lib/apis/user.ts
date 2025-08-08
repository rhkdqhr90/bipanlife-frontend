export const getMyProfile = async () => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/users/me`, {
    method: "GET",
    credentials: "include",
  });
  if (!res.ok) throw new Error("내 정보를 불러오지 못했습니다.");
  return res.json();
};

interface UpdateMyProfilePayload {
  nickname: string;
  profileImageUrl?: string;
  bio?: string;
}

export const updateMyProfile = async (payload: UpdateMyProfilePayload) => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/users/me`, {
    method: "PATCH",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) throw new Error("프로필 수정 실패");
  return res.json();
};

export const checkNicknameDuplicate = async (nickname: string) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/users/nickname-exist?nickname=${nickname}`,
    {
      method: "GET",
      credentials: "include",
    },
  );
  if (!res.ok) throw new Error("중복 확인 실패");
  const data = await res.json();
  return data.exists as boolean;
};

export const getMyPosts = async (page = 0, size = 10) => {
  const res = await fetch(`/api/posts/users/me?page=${page}&size=${size}`, {
    method: "GET",
    credentials: "include",
  });
  if (!res.ok) throw new Error("내 게시글 목록 불러오기 실패");
  return res.json(); // List<MyPostSimpleDto>
};

export const getMyComments = async (page = 0, size = 10) => {
  const res = await fetch(`/api/comments/users/me?page=${page}&size=${size}`, {
    method: "GET",
    credentials: "include",
  });
  if (!res.ok) throw new Error("내 댓글 목록 불러오기 실패");
  return res.json(); // List<SimpleCommentResponseDto>
};

export const deleteMyAccount = async () => {
  const res = await fetch("/auth/", {
    method: "DELETE",
    credentials: "include",
  });
  if (!res.ok) throw new Error("회원 탈퇴 실패");
  return res.text();
};
