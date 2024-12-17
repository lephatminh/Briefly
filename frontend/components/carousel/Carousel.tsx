"use client";

import React, { useState } from 'react';

interface Slide {
    url: string;
    caption: string;
}

interface CarouselProps {
    slides: Slide[];
}

export default function Carousel({ slides }: CarouselProps) {
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
        <div className="flex items-center justify-center h-screen bg-gray-100">
            <div className="relative max-w-xs mx-auto">
                {/* Carousel Wrapper */}
                <div className="overflow-hidden relative w-72">
                    <div
                        className="flex transition-transform duration-300 ease-in-out"
                        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
                    >
                        {slides.map((slide, index) => (
                            <div
                                key={index}
                                className="w-72 flex-shrink-0 flex flex-col items-center justify-center"
                            >
                                <img src={slide.url} alt={slide.caption} className="object-cover h-full w-full" onError={(e) => { e.currentTarget.src = '/placeholder.png'; }} />
                                <p className="mt-2 text-center text-gray-700">{slide.caption}</p>
                            </div>
                        ))}
                    </div>
                </div>
                {/* Navigation Buttons */}
                <button onClick={goToPrevious} className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-gray-800 text-white p-2 rounded-full">
                    ◄
                </button>
                <button onClick={goToNext} className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-gray-800 text-white p-2 rounded-full">
                    ►
                </button>
            </div>
        </div>
    );
}

