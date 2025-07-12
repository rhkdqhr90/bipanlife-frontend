"use client";

import { useEffect, useRef } from "react";

export interface MapDisplayProps {
  latitude: number;
  longitude: number;
  placeName?: string;
}

const MapDisplay = ({ latitude, longitude, placeName }: MapDisplayProps) => {
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined" || !window.kakao?.maps) return;

    window.kakao.maps.load(() => {
      const container = mapRef.current;
      if (!container) return;

      const options = {
        center: new window.kakao.maps.LatLng(latitude, longitude),
        level: 3,
      };

      const map = new window.kakao.maps.Map(container, options);

      const marker = new window.kakao.maps.Marker({
        map,
        position: new window.kakao.maps.LatLng(latitude, longitude),
      });

      if (placeName) {
        const infowindow = new window.kakao.maps.InfoWindow({
          content: `<div style="padding:5px;font-size:12px;">${placeName}</div>`,
        });
        infowindow.open(map, marker);
      }
    });
  }, [latitude, longitude, placeName]);

  return <div ref={mapRef} className="w-full h-[250px] rounded-lg border border-gray-200" />;
};

export default MapDisplay;
