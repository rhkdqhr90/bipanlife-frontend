/* eslint-disable @next/next/no-img-element */
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
            <div className="w-full rounded-lg overflow-hidden shadow-md bg-white">
              <img src={item.imageUrl} alt={item.title} className="w-full h-48 object-cover" />
              <div className="p-4">
                <h3 className="text-base font-semibold">{item.title}</h3>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
