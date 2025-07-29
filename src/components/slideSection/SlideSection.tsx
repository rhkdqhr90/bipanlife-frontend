"use client";

import "keen-slider/keen-slider.min.css";
import { useKeenSlider } from "keen-slider/react";
import type { SlideSectionProps } from "@/types/SlideSectionProps";
import React from "react";

export const SlideSection = ({ title, description, items }: SlideSectionProps) => {
  const [sliderRef] = useKeenSlider<HTMLDivElement>({
    loop: true,
    slides: {
      perView: 1,
      spacing: 16,
    },
    breakpoints: {
      "(min-width: 640px)": {
        slides: {
          perView: 1,
          spacing: 16,
        },
      },
      "(min-width: 1024px)": {
        slides: {
          perView: 1,
          spacing: 16,
        },
      },
    },
  });

  return (
    <section className="px-4">
      <h2 className="text-xl font-bold mb-2">{title}</h2>
      {description && <p className="text-sm text-gray-500 mb-4">{description}</p>}

      <div ref={sliderRef} className="keen-slider">
        {items.map(item => (
          <div key={item.id} className="keen-slider__slide">
            <div className="w-full rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-10 shadow-md flex flex-col justify-center items-center min-h-[200px]">
              <p className="text-center text-lg font-semibold leading-relaxed max-w-3xl">
                {item.title}
              </p>
              <span className="mt-4 text-sm text-white/80">- {item.author}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
