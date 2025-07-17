"use client";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { KakaoPlace } from "@/types/kakao";

interface MapSearchModalProps {
  onClose: () => void;
  onSelectLocation: (location: {
    placeName: string;
    address: string;
    latitude: number;
    longitude: number;
  }) => void;
  isKakaoMapLoaded: boolean;
}

export const MapSearchModal = ({
  onClose,
  onSelectLocation,
  isKakaoMapLoaded,
}: MapSearchModalProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const markerRef = useRef<kakao.maps.Marker | null>(null);
  const mapInstanceRef = useRef<kakao.maps.Map | null>(null);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<KakaoPlace | null>(null);

  useEffect(() => {
    console.log("✅ useEffect 실행됨");
    const mapDiv = mapRef.current;
    console.log("🔍 mapRef.current:", mapDiv);
    if (!window.kakao || !window.kakao.maps || !isKakaoMapLoaded || !mapRef.current) {
      console.warn("지도 준비 안됨");
      return;
    }

    const options: kakao.maps.MapOptions = {
      center: new window.kakao.maps.LatLng(37.5665, 126.978),
      level: 3,
      disableDoubleClickZoom: true,
      scrollwheel: false,
    };

    const map = new window.kakao.maps.Map(mapRef.current, options);
    mapInstanceRef.current = map;

    setTimeout(() => {
      map.relayout();

      const latLng = new window.kakao.maps.LatLng(37.5665, 126.978);
      const marker = new window.kakao.maps.Marker({
        position: latLng,
        map: map,
      });
      markerRef.current = marker;
    }, 300);
    console.log("✅ 지도 생성 조건 통과됨");
  }, [isKakaoMapLoaded]);

  const handleSearch = () => {
    if (!query || !window.kakao?.maps?.services) return;
    const map = mapInstanceRef.current;
    if (!map) return;

    const ps = new window.kakao.maps.services.Places();
    ps.keywordSearch(
      query,
      (
        data: any, // eslint-disable-line @typescript-eslint/no-explicit-any
        status: any, // eslint-disable-line @typescript-eslint/no-explicit-any
      ) => {
        if (status === "OK" && data.length > 0) {
          const raw = data[0];
          const place: KakaoPlace = {
            id: raw.id,
            place_name: raw.place_name,
            address_name: raw.address_name || raw.road_address_name || "",
            road_address_name: raw.road_address_name || "",
            phone: raw.phone || "",
            x: raw.x,
            y: raw.y,
          };

          const latLng = new window.kakao.maps.LatLng(Number(place.y), Number(place.x));

          map.setCenter(latLng);

          if (markerRef.current) {
            markerRef.current.setMap(null);
          }

          const marker = new window.kakao.maps.Marker({
            map,
            position: latLng,
          });
          markerRef.current = marker;

          setSelected(place);
        }
      },
    );
  };

  const handleInsert = () => {
    if (!selected) return;
    onSelectLocation({
      placeName: selected.place_name,
      address: selected.address_name,
      latitude: Number(selected.y),
      longitude: Number(selected.x),
    });
    onClose();
  };

  if (!isKakaoMapLoaded) {
    return createPortal(
      <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
        <div className="bg-white w-full max-w-xl p-6 rounded shadow text-center">
          <p className="text-gray-700">⏳ 카카오 지도를 불러오는 중입니다...</p>
        </div>
      </div>,
      document.body,
    );
  }

  return createPortal(
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-xl p-4 rounded shadow relative">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-lg font-semibold">지도 검색</h2>
          <button onClick={onClose}>✖️</button>
        </div>
        <input
          type="text"
          placeholder="장소를 입력하세요"
          value={query}
          onChange={e => setQuery(e.target.value)}
          onKeyDown={e => e.key === "Enter" && handleSearch()}
          className="border px-2 py-1 w-full mb-2"
        />
        <div ref={mapRef} className="w-full h-[400px] min-h-[400px] border mb-2" />
        <button
          onClick={handleInsert}
          disabled={!selected}
          className="bg-blue-600 text-white px-4 py-2 rounded w-full disabled:opacity-50"
        >
          장소 선택
        </button>
      </div>
    </div>,
    document.body,
  );
};
