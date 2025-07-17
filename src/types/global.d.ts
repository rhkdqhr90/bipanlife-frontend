// src/types/kakao.d.ts
export {};

declare global {
  interface Window {
    kakao: KakaoNamespace;
  }

  interface KakaoNamespace {
    maps: typeof kakao.maps;
  }

  namespace kakao {
    namespace maps {
      class LatLng {
        constructor(latitude: number, longitude: number);
      }

      interface MapOptions {
        center: LatLng;
        level: number;
      }

      class Marker {
        constructor(options: MarkerOptions);
        setMap(map: Map | null): void;
      }

      interface MarkerOptions {
        position: LatLng;
      }

      class InfoWindow {
        constructor(options: InfoWindowOptions);
        open(map: Map, marker: Marker): void;
      }

      interface InfoWindowOptions {
        content: string;
      }

      function load(callback: () => void): void;
    }
  }
}
