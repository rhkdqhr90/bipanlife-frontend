// components/home/HeroSection.tsx
import Link from "next/link";

const HeroSection = () => {
  return (
    <section className="bg-gradient-to-r from-blue-100 to-white py-20 px-4">
      <div className="max-w-5xl mx-auto text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-800 leading-tight mb-6">
          건강한 비판이
          <br className="md:hidden" /> 건강한 사회를 만든다
        </h1>
        <p className="text-lg md:text-xl text-gray-600 mb-8">
          비판생은 건전한 의견을 나누고, 사회를 더 나은 방향으로 바꾸기 위한 커뮤니티입니다.
        </p>
        <div className="flex justify-center gap-4 flex-wrap">
          <Link
            href="/signup"
            className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700 transition"
          >
            지금 시작하기
          </Link>
          <Link
            href="/community"
            className="border border-blue-600 text-blue-600 px-6 py-3 rounded hover:bg-blue-100 transition"
          >
            커뮤니티 둘러보기
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
