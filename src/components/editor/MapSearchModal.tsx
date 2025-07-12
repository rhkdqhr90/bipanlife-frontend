"use client";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

interface MapSearchModalProps {
  onClose: () => void;
  onSelect: (iframeSrc: string) => void;
  isKakaoMapLoaded: boolean; // Added this line
}

export const MapSearchModal = ({ onClose, onSelect, isKakaoMapLoaded }: MapSearchModalProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<kakao.maps.services.PlaceResult | null>(null);

  useEffect(() => {
    if (!isKakaoMapLoaded || typeof window === "undefined" || !window.kakao || !window.kakao.maps)
      return;

    const map = new window.kakao.maps.Map(mapRef.current!, {
      center: new window.kakao.maps.LatLng(37.5665, 126.978), // 서울 기본
      level: 3,
    });

    const ps = new window.kakao.maps.services.Places();

    const handleSearch = () => {
      if (!query) return;
      ps.keywordSearch(query, (data, status) => {
        console.log("Kakao Places Search Result:", { data, status });
        if (status === window.kakao.maps.services.Status.OK) {
          const place = data[0]; // 첫 번째 결과만 사용
          const latLng = new window.kakao.maps.LatLng(place.y, place.x);
          map.setCenter(latLng);
          new window.kakao.maps.Marker({ map, position: latLng });
          setSelected(place);
        } else {
          console.error("Kakao Places Search Failed:", status);
        }
      });
    };

    handleSearch();
  }, [query]);

  const handleInsert = () => {
    if (!selected) {
      console.log("No place selected to insert.");
      return;
    }
    const iframeSrc = `https://map.kakao.com/link/map/${selected.place_name},${selected.y},${selected.x}`;
    console.log("Inserting iframe with src:", iframeSrc);
    onSelect(iframeSrc);
    onClose();
  };

  return createPortal(
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-xl p-4 rounded shadow">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-lg font-semibold">지도 검색</h2>
          <button onClick={onClose}>✖️</button>
        </div>
        <input
          type="text"
          placeholder="장소를 입력하세요"
          value={query}
          onChange={e => setQuery(e.target.value)}
          className="border px-2 py-1 w-full mb-2"
        />
        <div ref={mapRef} className="w-full h-64 border mb-2" />
        <button onClick={handleInsert} className="bg-blue-600 text-white px-4 py-2 rounded w-full">
          지도 삽입
        </button>
      </div>
    </div>,
    document.body,
  );
};
