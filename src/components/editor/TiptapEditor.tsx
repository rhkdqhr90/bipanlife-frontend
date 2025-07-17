"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Image from "@tiptap/extension-image";
import { useRef, useState, useEffect } from "react";
import { MapSearchModal } from "../map/MapSearchModal";
import { MapPin, Bold, Italic, Strikethrough, Heading2, ImageIcon } from "lucide-react";
import { useKakaoLoader } from "@/components/map/userKakaoLoader";
import { uploadImages } from "@/lib/apis/uploadImages";
interface LocationInfo {
  placeName: string;
  address: string;
  latitude: number;
  longitude: number;
}

interface TiptapEditorProps {
  content: string;
  onChange: (html: string) => void;
  onSelectLocation?: (location: LocationInfo) => void;
}

export const TiptapEditor = ({ content, onChange, onSelectLocation }: TiptapEditorProps) => {
  const [showMapModal, setShowMapModal] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<LocationInfo | null>(null);
  const mapInstanceRef = useRef<kakao.maps.Map | null>(null);
  const isKakaoMapLoaded = useKakaoLoader();
  const mapRef = useRef<HTMLDivElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null); //파일 업로드

  const editor = useEditor({
    extensions: [
      StarterKit.configure({ heading: { levels: [1, 2, 3] } }),
      Placeholder.configure({ placeholder: "내용을 입력하세요..." }),
      Image,
    ],
    content,
    onUpdate({ editor }) {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class:
          "prose prose-sm sm:prose lg:prose-lg xl:prose-xl max-w-full focus:outline-none p-4 min-h-[300px] max-h-[500px] overflow-y-auto bg-white rounded-b-lg border-x border-b border-gray-300",
      },
    },
  });

  // 🔧 위치 선택 처리 함수
  const handleLocationSelect = (location: LocationInfo) => {
    console.log("📍 선택된 위치:", location);
    setSelectedLocation(location); // 내부 상태 업데이트
    setShowMapModal(false); // 모달 닫기
    onSelectLocation?.(location); // 상위로 전달 (옵셔널)
  };

  const handleMultiImageUpload = async (files: File[]) => {
    if (!files.length || !editor) return;

    try {
      const urls = await uploadImages(files);
      urls.forEach(url => {
        editor.chain().focus().setImage({ src: url }).run();
      });
    } catch (err) {
      console.error("이미지 업로드 실패:", err);
      alert("이미지 업로드 중 오류가 발생했습니다.");
    }
  };

  // 지도 리사이징 (모달 오픈 후)
  useEffect(() => {
    if (!isKakaoMapLoaded || !showMapModal) return;

    const container = mapRef.current;
    if (!container) return;
    const options = {
      center: new window.kakao.maps.LatLng(37.5665, 126.978),
      level: 3,
    };

    const map = new window.kakao.maps.Map(container, options);
    mapInstanceRef.current = map;
  }, [isKakaoMapLoaded, showMapModal]);

  return (
    <div className="w-full">
      {/* 툴바 */}
      <div className="flex gap-2 border px-2 py-1 bg-gray-100 rounded-t">
        <button onClick={() => editor?.chain().focus().toggleBold().run()}>
          <Bold size={16} />
        </button>
        <button onClick={() => editor?.chain().focus().toggleItalic().run()}>
          <Italic size={16} />
        </button>
        <button onClick={() => editor?.chain().focus().toggleStrike().run()}>
          <Strikethrough size={16} />
        </button>
        <button onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}>
          <Heading2 size={16} />
        </button>
        <button onClick={() => fileInputRef.current?.click()}>
          <ImageIcon size={16} />
        </button>
        <button
          onClick={() => {
            setShowMapModal(true);
          }}
          disabled={!isKakaoMapLoaded}
        >
          <MapPin size={16} />
        </button>
      </div>
      {/* 파일 입력 */}
      <input
        ref={fileInputRef}
        type="file"
        multiple // ✅ 이걸 꼭 넣어야 여러 파일 선택 가능
        onChange={e => {
          if (!e.target.files) return;
          const fileArray = Array.from(e.target.files); // ✅ FileList → File[]
          handleMultiImageUpload(fileArray);
        }}
        className="hidden"
      />

      {/* 에디터 */}
      <EditorContent editor={editor} className="custom-editor" />

      {/* 선택된 위치 미리 보기 (선택사항) */}
      {selectedLocation && (
        <div className="mt-4 text-sm text-gray-600">
          <p>📌 장소명: {selectedLocation.placeName}</p>
          <p>📍 주소: {selectedLocation.address}</p>
          <p>
            📐 좌표: {selectedLocation.latitude}, {selectedLocation.longitude}
          </p>
        </div>
      )}

      {/* 지도 검색 모달 */}
      {showMapModal && (
        <MapSearchModal
          onClose={() => {
            console.log("❌ 지도 모달 닫힘");
            setShowMapModal(false);
          }}
          isKakaoMapLoaded={isKakaoMapLoaded}
          onSelectLocation={handleLocationSelect}
        />
      )}
    </div>
  );
};
