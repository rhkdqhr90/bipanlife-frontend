export const runtime = "edge";
import HomePage from "@/components/home/homePage";
import { quoteSlides } from "@/components/image/slideItems";
import { getHotBestItems, getHotNowItems } from "@/lib/apis/home";

export default async function Home() {
  const hotBestItems = await getHotBestItems();
  const hotNowItems = await getHotNowItems();
  const slideItems = quoteSlides;
  // src/app/page.tsx
  console.log("✅ API BASE URL:", process.env.NEXT_PUBLIC_API_BASE_URL);
  return <HomePage slideItems={slideItems} hotBestItems={hotBestItems} hotNowItems={hotNowItems} />;
}
