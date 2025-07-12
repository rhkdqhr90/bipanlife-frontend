declare namespace kakao {
  namespace maps {
    function load(callback: () => void): void;

    class Map {
      constructor(container: HTMLElement, options: MapOptions);
      setCenter(latLng: LatLng): void;
      // Add other methods/properties of Map class as needed
    }

    class LatLng {
      constructor(lat: number, lng: number);
      // Add other methods/properties of LatLng class as needed
    }

    class Marker {
      constructor(options: MarkerOptions);
      // Add other methods/properties of Marker class as needed
    }

    interface MarkerOptions {
      map: Map;
      position: LatLng;
      // Add other marker options as needed
    }

    namespace services {
      class Places {
        constructor();
        keywordSearch(query: string, callback: (data: PlaceResult[], status: Status) => void): void;
        // Add other methods/properties of Places class as needed
      }

      enum Status {
        OK = "OK",
        ZERO_RESULT = "ZERO_RESULT",
        ERROR = "ERROR",
        // Add other status types if needed
      }

      interface PlaceResult {
        place_name: string;
        x: number; // longitude
        y: number; // latitude
        // Add other properties of PlaceResult as needed
      }
    }

    interface MapOptions {
      center: LatLng;
      level: number;
      // Add other map options as needed
    }

    // Add other kakao.maps types as needed
  }
  // Add other kakao properties/methods if needed
}

declare global {
  interface Window {
    kakao: typeof kakao;
  }
}
