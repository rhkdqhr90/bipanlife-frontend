export const runtime = "edge";
// app/critic/page.tsx
import { redirect } from "next/navigation";

export default function Page() {
  redirect("/critic/restaurant"); // 혹은 기본 boardCode
}
