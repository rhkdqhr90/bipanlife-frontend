// /critic/page.tsx
import { redirect } from "next/navigation";
import { getPanels } from "@/lib/apis/getPanels";

export default async function CriticPage() {
  const navLinks = await getPanels();
  const criticPanel = navLinks.find(panel => panel.name === "비판");

  // 첫 번째 비판 게시판으로 리다이렉트
  if (criticPanel?.dropdown?.[0]?.href) {
    redirect(criticPanel.dropdown[0].href);
  }

  // fallback - 만약 동적으로 못 가져오면 politics로
  redirect("/critic/politics");
}
