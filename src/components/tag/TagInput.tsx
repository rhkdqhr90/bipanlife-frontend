"use client";

import { useState, useRef } from "react";

interface TagInputProps {
  tags: string[];
  setTags: (tags: string[]) => void;
}

export const TagInput = ({ tags, setTags }: TagInputProps) => {
  const [input, setInput] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    // 띄어쓰기 기준으로 태그 구분
    if (value.includes(" ")) {
      const newTags = value
        .trim()
        .split(" ")
        .map(tag => (tag.startsWith("#") ? tag : `#${tag}`))
        .filter(tag => tag.length > 1 && !tags.includes(tag));

      if (tags.length + newTags.length > 8) {
        alert("태그는 최대 8개까지 입력할 수 있습니다.");
        return;
      }

      setTags([...tags, ...newTags]);
      setInput("");
    } else {
      setInput(value);
    }
  };

  const handleRemove = (tag: string) => {
    setTags(tags.filter(t => t !== tag));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && input === "") {
      const updated = [...tags];
      updated.pop();
      setTags(updated);
    }
  };

  return (
    <div className="mt-8">
      <label className="block text-sm font-medium text-gray-700 mb-2">태그</label>
      <div className="flex flex-wrap items-center gap-2 p-2 border border-gray-300 rounded-lg bg-white focus-within:border-blue-500">
        {tags.map(tag => (
          <span
            key={tag}
            className="flex items-center px-2 py-1 bg-blue-100 text-blue-700 text-sm rounded-full"
          >
            {tag}
            <button
              onClick={() => handleRemove(tag)}
              className="ml-1 text-blue-400 hover:text-blue-600 text-xs"
              type="button"
            >
              &times;
            </button>
          </span>
        ))}
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder="#태그명 입력 후 띄어쓰기"
          className="flex-grow outline-none text-sm p-1 min-w-[120px]"
        />
      </div>
      <p className="text-xs text-gray-400 mt-1">최대 8개, 띄어쓰기로 구분, # 자동 추가</p>
    </div>
  );
};
