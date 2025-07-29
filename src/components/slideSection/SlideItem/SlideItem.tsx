// src/components/slideSection/SlideItem/SlideItem.tsx

import React from "react";

interface SlideItemProps {
  title: string;
  imageUrl?: string;
  author?: string;
}

const SlideItem = ({ title, imageUrl, author }: SlideItemProps) => {
  return (
    <div className="keen-slider__slide px-2">
      <div className="rounded-lg overflow-hidden shadow-md bg-white h-64 flex flex-col justify-center items-center p-4 text-center">
        {imageUrl ? (
          <>
            <h3 className="mt-2 text-base font-semibold">{title}</h3>
          </>
        ) : (
          <>
            <p className="text-base font-medium text-gray-800 whitespace-pre-line">“{title}”</p>
            {author && <span className="mt-2 text-sm text-gray-500">– {author}</span>}
          </>
        )}
      </div>
    </div>
  );
};

export default SlideItem;
