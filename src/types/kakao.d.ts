export {};

declare global {
  interface Window {
    kakao: typeof kakao;
  }

  namespace kakao.maps {
    class LatLng {
      constructor(lat: number, lng: number);
      getLat(): number;
      getLng(): number;
    }

    interface MapOptions {
      center: LatLng;
      level?: number;
      disableDoubleClickZoom?: boolean;
      scrollwheel?: boolean;
    }

    class Map {
      constructor(container: HTMLElement, options: MapOptions);
      setCenter(latlng: LatLng): void;
      getCenter(): LatLng;
      relayout(): void;
    }

    interface MarkerOptions {
      map: Map;
      position: LatLng;
    }

    class Marker {
      constructor(options: MarkerOptions);
      setMap(map: Map | null): void;
    }

    class InfoWindow {
      constructor(options: { content: string });
      open(map: Map, marker: Marker): void;
    }

    namespace services {
      class Places {
        keywordSearch(
          keyword: string,
          callback: (data: PlacesSearchResult[], status: Status) => void,
        ): void;
      }

      interface PlacesSearchResult {
        id: string;
        place_name: string;
        address_name: string;
        road_address_name?: string;
        phone?: string;
        x: string;
        y: string;
      }

      type Status = "OK" | "ZERO_RESULT" | "ERROR";
    }
  }
}

// KakaoPlace는 따로 export해서 사용
export interface KakaoPlace {
  id: string;
  place_name: string;
  address_name: string;
  road_address_name: string;
  phone: string;
  x: string;
  y: string;
}
