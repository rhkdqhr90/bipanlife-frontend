"use strict";

import React from "react";

interface SlideItemProps {
  title: string;
  imageUrl: string;
}

const SlideItem = ({ title, imageUrl }: SlideItemProps) => {
  return (
    <div className="keen-slider__slide px-2">
      <div className="rounded-lg overflow-hidden shadow-md bg-white">
        <img src={imageUrl} alt={title} className="w-full h-48 object-cover" />
        <div className="p-4">
          <h3 className="text-lg font-semibold">{title}</h3>
        </div>
      </div>
    </div>
  );
};

export default SlideItem;
