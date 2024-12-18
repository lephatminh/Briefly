"use client";

import React, { useState } from 'react';
import ImageWithFallback from '../image/ImageWithFallback';
import { ArticleImage } from '@/types/article';

interface CarouselProps {
  slides: ArticleImage[];
  className?: string,
}

export default function Carousel({ slides, className }: CarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const goToPrevious = () => {
      const isFirstSlide = currentIndex === 0;
      const newIndex = isFirstSlide ? slides.length - 1 : currentIndex - 1;
      setCurrentIndex(newIndex);
  };

  const goToNext = () => {
      const isLastSlide = currentIndex === slides.length - 1;
      const newIndex = isLastSlide ? 0 : currentIndex + 1;
      setCurrentIndex(newIndex);
  };

  return (
    <div className={`flex justify-center ${className}`}>
      <div className="relative mx-auto">
        {/* Carousel Wrapper */}
        <div className="overflow-hidden relative lg:w-72 w-48">
          <div
            className="flex transition-transform duration-300 ease-in-out"
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            {slides.map((slide, index) => (
              <div
                key={index}
                className="w-full flex-shrink-0 flex flex-col bg-gray-100 dark:bg-gray-500 p-3 rounded-xl"
              >
                <ImageWithFallback 
                  imgSrc={slide.url} 
                  fallbackSrc='/blank-img.svg'
                  alt={slide.alt} 
                  width={200} height={200} 
                  className="object-contain lg:w-72 lg:h-72 w-48 h-48" 
                />
                <p className="mt-2 text-center text-gray-500 dark:text-gray-300 font-medium">{slide.alt}</p>
              </div>
            ))}
          </div>
        </div>
        {/* Navigation Buttons */}
        {slides.length > 1 && (
          <div>
            <button onClick={goToPrevious} className="absolute -left-8 top-1/2 transform -translate-y-1/2 z-10 bg-gray-800 text-white p-2 rounded-full">
              ◄
            </button>
            <button onClick={goToNext} className="absolute -right-8 top-1/2 transform -translate-y-1/2 z-10 bg-gray-800 text-white p-2 rounded-full">
              ►
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

