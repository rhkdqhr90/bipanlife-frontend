import HomePage from "@/components/home/homePage";
import { quoteSlides } from "@/components/image/slideItems";
import { getHotBestItems, getHotNowItems } from "@/lib/apis/home";

export default async function Home() {
  const hotBestItems = await getHotBestItems();
  const hotNowItems = await getHotNowItems();
  const slideItems = quoteSlides;

  return <HomePage slideItems={slideItems} hotBestItems={hotBestItems} hotNowItems={hotNowItems} />;
}
