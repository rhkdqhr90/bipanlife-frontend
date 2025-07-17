// hooks/useKakaoLoader.ts
import { useEffect, useState } from "react";

export function useKakaoLoader() {
  const [isKakaoMapLoaded, setIsKakaoMapLoaded] = useState(false);

  useEffect(() => {
    const key = process.env.NEXT_PUBLIC_KAKAO_JS_KEY;
    if (!key) {
      console.error("❌ Kakao API Key가 설정되지 않았습니다.");
      return;
    }

    if (typeof window === "undefined") return;

    const scriptId = "kakao-map-sdk";
    const existingScript = document.getElementById(scriptId);
    if (existingScript) {
      // 이미 로드된 경우
      if (window.kakao && window.kakao.maps) {
        setIsKakaoMapLoaded(true);
      } else {
        existingScript.addEventListener("load", () => {
          window.kakao.maps.load(() => setIsKakaoMapLoaded(true));
        });
      }
      return;
    }

    const script = document.createElement("script");
    script.id = scriptId;
    script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${key}&libraries=services&autoload=false`;
    script.async = true;
    script.onload = () => {
      window.kakao.maps.load(() => {
        console.log("✅ Kakao 지도 SDK 완전 로드됨");
        setIsKakaoMapLoaded(true);
      });
    };

    document.head.appendChild(script);
  }, []);

  return isKakaoMapLoaded;
}
