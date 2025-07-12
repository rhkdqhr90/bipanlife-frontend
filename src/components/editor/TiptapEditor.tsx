"use client";
import { useEditor, EditorContent, Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Image from "@tiptap/extension-image";
import { Bold, Italic, Strikethrough, Heading2, ImageIcon, MapPin } from "lucide-react";
import { Iframe } from "./extensions/Iframe";
import { MapSearchModal } from "./MapSearchModal";
import { useEffect, useCallback, useState } from "react";

// Toolbar Component
const TiptapToolbar = ({
  editor,
  isKakaoMapLoaded,
}: {
  editor: Editor | null;
  isKakaoMapLoaded: boolean;
}) => {
  const [isMapModalOpen, setIsMapModalOpen] = useState(false);

  const addImage = useCallback(() => {
    if (!editor) return;
    const url = window.prompt("이미지 URL을 입력하세요");

    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  }, [editor]);

  const handleMapSelect = useCallback(
    (iframeSrc: string) => {
      if (!editor) return;
      console.log("handleMapSelect called with iframeSrc:", iframeSrc);
      editor.chain().focus().setIframe({ src: iframeSrc }).run();
      console.log("setIframe command executed.");
      setIsMapModalOpen(false);
    },
    [editor],
  );

  if (!editor) return null;

  return (
    <>
      <div className="flex items-center space-x-1 border-b border-gray-300 bg-gray-50 p-2 rounded-t-lg">
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`p-2 rounded ${editor.isActive("bold") ? "bg-gray-300" : "hover:bg-gray-200"}`}
          title="Bold"
        >
          <Bold className="w-4 h-4" />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`p-2 rounded ${editor.isActive("italic") ? "bg-gray-300" : "hover:bg-gray-200"}`}
          title="Italic"
        >
          <Italic className="w-4 h-4" />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleStrike().run()}
          className={`p-2 rounded ${editor.isActive("strike") ? "bg-gray-300" : "hover:bg-gray-200"}`}
          title="Strikethrough"
        >
          <Strikethrough className="w-4 h-4" />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`p-2 rounded ${editor.isActive("heading", { level: 2 }) ? "bg-gray-300" : "hover:bg-gray-200"}`}
          title="Heading 2"
        >
          <Heading2 className="w-4 h-4" />
        </button>
        <button onClick={addImage} className="p-2 rounded hover:bg-gray-200" title="Add Image">
          <ImageIcon className="w-4 h-4" />
        </button>
        <button
          onClick={() => setIsMapModalOpen(true)}
          className={`p-2 rounded hover:bg-gray-200 ${!isKakaoMapLoaded && "opacity-50 cursor-not-allowed"}`}
          title="Search Map"
          disabled={!isKakaoMapLoaded}
        >
          <MapPin className="w-4 h-4" />
        </button>
      </div>

      {isMapModalOpen && (
        <MapSearchModal
          onClose={() => setIsMapModalOpen(false)}
          onSelect={handleMapSelect}
          isKakaoMapLoaded={isKakaoMapLoaded}
        />
      )}
    </>
  );
};

// Main Editor Component
interface TiptapEditorProps {
  content: string;
  onChange: (content: string) => void;
  isKakaoMapLoaded: boolean;
}

const TiptapEditor = ({ content, onChange }: TiptapEditorProps) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Placeholder.configure({
        placeholder: "내용을 입력하세요...",
      }),
      Image.configure({
        inline: true,
      }),
      Iframe,
    ],
    content: content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class:
          "prose prose-sm sm:prose lg:prose-lg xl:prose-xl max-w-full focus:outline-none p-4 min-h-[250px] border-t-0 rounded-b-lg",
      },
    },
  });

  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content, false);
    }
  }, [content, editor]);

  return (
    <div className="border border-gray-300 rounded-lg overflow-hidden">
      <TiptapToolbar editor={editor} isKakaoMapLoaded={true} />
      <div className="max-h-[400px] overflow-y-auto">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
};

export default TiptapEditor;
