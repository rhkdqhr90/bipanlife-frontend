// components/map/KakaoMapViewer.tsx
"use client";

import { useEffect, useRef } from "react";
import { useKakaoLoader } from "./userKakaoLoader";

interface KakaoMapViewerProps {
  latitude: number;
  longitude: number;
  placeName?: string;
}

export const KakaoMapViewer = ({ latitude, longitude, placeName }: KakaoMapViewerProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const isKakaoLoaded = useKakaoLoader();

  useEffect(() => {
    if (!isKakaoLoaded) {
      console.log("⏳ Kakao SDK 아직 로딩 중...");
      return;
    }

    if (!mapRef.current || !window.kakao || !window.kakao.maps) {
      console.warn("🛑 mapRef 혹은 window.kakao.maps가 없습니다.");
      return;
    }

    const latLng = new window.kakao.maps.LatLng(latitude, longitude);
    const map = new window.kakao.maps.Map(mapRef.current, {
      center: latLng,
      level: 3,
    });

    const marker = new window.kakao.maps.Marker({
      position: latLng,
      map,
    });

    const infoWindow = new window.kakao.maps.InfoWindow({
      content: `<div style="padding:5px;">📍 ${placeName ?? "위치"}</div>`,
    });

    infoWindow.open(map, marker);
  }, [isKakaoLoaded, latitude, longitude, placeName]);

  return (
    <div
      ref={mapRef}
      className="w-full h-[300px] rounded border mt-2"
      style={{ backgroundColor: "#eee" }}
    />
  );
};
