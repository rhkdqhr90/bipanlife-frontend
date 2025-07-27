export interface NavLink {
  name: string;
  href?: string;
  dropdown?: MenuItem[];
}

export interface MenuItem {
  name: string;
  href: string;
}
export interface Board {
  id: number;
  boardGroup: string;
  boardCode: string;
  boardName: string;
  description: string;
  isActive: boolean;
}

const groupNameMap: Record<string, string> = {
  NOTICE: "공지",
  HUMOR: "유머",
  FREE: "자유",
  DISCUSSION: "토론방",
  HOT: "핫판",
  CRITICISM: "비판",
  PRAISE: "칭찬",
};

const groupOrder: Record<string, number> = {
  NOTICE: 7,
  HUMOR: 6,
  FREE: 5,
  DISCUSSION: 4,
  PRAISE: 3,
  CRITICISM: 2,
  HOT: 1,
};

export async function getPanels(): Promise<NavLink[]> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/boards`, {
    cache: "no-store",
    credentials: "include",
  });
  if (!res.ok) {
    throw new Error("게시판 목록을 불러오지 못했습니다.");
  }

  const data: Board[] = await res.json();

  // 🔹 1. group by boardGroup
  const grouped = data.reduce<Record<string, Board[]>>((acc, cur) => {
    const group = cur.boardGroup;
    if (!acc[group]) acc[group] = [];
    acc[group].push(cur);
    return acc;
  }, {});

  // 2. 게시판 순서를 위한 Sort
  const sortedGroups = Object.entries(grouped).sort(
    ([a], [b]) => (groupOrder[a] || 99) - (groupOrder[b] || 99),
  );

  return sortedGroups.map(([group, boards]) => {
    // CRITICISM 그룹인 경우 특별 처리
    if (group === "CRITICISM") {
      return {
        name: groupNameMap[group] || group,
        href: `/critic/${boards[0].boardCode.replace("critic/", "")}`, // critic/ 접두사 제거
        dropdown: boards.map(board => ({
          name: board.boardName,
          href: `/critic/${board.boardCode.replace("critic/", "")}`, // critic/ 접두사 제거
        })),
      };
    }

    // 🔹 3. 각 그룹을 NavLink 형태로 변환
    return {
      name: groupNameMap[group] || group,
      href: `/${boards[0].boardCode}`,
      dropdown: boards.map(board => ({
        name: board.boardName,
        href: `/${board.boardCode}`,
      })),
    };
  });
}
