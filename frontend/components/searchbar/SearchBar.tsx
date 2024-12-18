'use client'
import { useState } from "react";
import { ArticleInterface } from "@/types/article";
import { FaMagnifyingGlass } from 'react-icons/fa6'
import { HiOutlineMicrophone } from 'react-icons/hi'
import { useRouter } from "next/navigation";
import ImageWithFallback from "../image/ImageWithFallback";

type Props = {
  className?: string,
};

export default function SearchBar({ className }: Props) {
  const router = useRouter();
  const [suggestions, setSuggestions] = useState<ArticleInterface[]>([]);

  const fetchSuggestions = async (keyword: string) => {
    if (!keyword) {
      setSuggestions([]);
      return;
    }

    try {
      const response = await fetch(`http://127.0.0.1:8000/search?q=${encodeURIComponent(keyword)}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (response.ok) {
        const data = await response.json();
        setSuggestions(data.suggestions || []);
      } else {
        console.error("Failed to fetch suggestions");
      }
    } catch (error) {
      console.error("Error fetching suggestions:", error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    fetchSuggestions(value);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && suggestions.length > 0) {
      handleSubmit(suggestions[0]);
    }
  };

  const handleSubmit = (suggestion: ArticleInterface) => {
    if (suggestion) {
      setSuggestions([]);
      router.push(`/article?id=${suggestion.post.id}`);
    }
  };

  return (
    <div className={`flex items-center max-w-xl px-4 py-2 ${className}`}>
      <FaMagnifyingGlass className="text-xl md:[@media(min-height:600px)]:text-3xl text-gray-400 dark:text-white me-2" />
      <div className={`relative w-full`}>
        <input
          type="text"
          onChange={handleInputChange}
          onKeyDown={handleKeyPress}
          placeholder="Type the name of your subject..."
          className="text-lg sm:text-xl md:[@media(min-height:600px)]:text-2xl w-full dark:bg-[#232323] px-1 py-2 text-gray-900 dark:text-white focus:outline-none placeholder:text-gray-400 dark:placeholder:text-gray-300 border-b-2 border-b-gray-200 dark:border-b-gray-300 transition duration-50"
        />
        {suggestions.length > 0 && (
          <ul className="absolute z-10 bg-white dark:bg-[#232323] top-full left-0 w-full border border-gray-300 rounded-md shadow-md max-h-64 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 dark:scrollbar-thumb-[#3e3e3e] dark:scrollbar-track-[#232323]">
            {suggestions.map((suggestion, index) => (
              <li
                key={index}
                onClick={() => handleSubmit(suggestion)}
                className="px-4 py-2 group hover:bg-[#232323] dark:hover:bg-white cursor-pointer"
              >
                <div className="flex items-center h-20">
                  <ImageWithFallback
                    width={50}
                    height={50}
                    imgSrc={suggestion.post.image.url}
                    alt={suggestion.post.image.alt}
                    fallbackSrc="/blank-img.svg"
                    className="h-12 w-12 object-contain dark:bg-white group-hover:bg-white rounded-3xl"
                  />
                  <div className="ms-3 h-full overflow-hidden flex flex-col justify-center">
                    <p className="flex flex-col justify-center h-full text-gray-600 group-hover:text-gray-300 dark:text-gray-300 dark:group-hover:text-gray-600">
                      <span className="text-lg sm:text-xl md:[@media(min-height:600px)]:text-2xl text-gray-900 group-hover:text-white dark:text-white dark:group-hover:text-gray-900">
                        {suggestion.post.title}
                      </span>
                      <span className="text-xs sm:text-sm md:[@media(min-height:600px)]:text-base overflow-hidden hidden md:[@media(min-height:600px)]:block">{suggestion.text}</span>
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
      <button className="text-xl md:[@media(min-height:600px)]:text-3xl text-gray-400 dark:text-white hover:text-gray-500 dark:hover:text-gray-400 transition duration-300 ms-1">
        <HiOutlineMicrophone />
      </button>
    </div>
  );
};
