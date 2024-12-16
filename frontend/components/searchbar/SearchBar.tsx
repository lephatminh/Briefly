'use client'
import { useState } from "react";
import { ArticleInterface } from "@/types/article";
import { FaMagnifyingGlass } from 'react-icons/fa6'
import { HiOutlineMicrophone } from 'react-icons/hi'
import { useRouter } from "next/navigation";
import ImageWithFallback from "../image/ImageWithFallback";

type Props = {
  size?: 'small' | 'large',
  className?: string,
};

export default function SearchBar({ size='large', className }: Props) {
  const router = useRouter();
  const [query, setQuery] = useState("");
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
        console.log(data);
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
    setQuery(value);
    fetchSuggestions(value);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSubmit(query);
    }
  };

  const handleSubmit = (suggestion: string) => {
    setQuery("");
    setSuggestions([]);
    alert(`You selected: ${suggestion}`); // Replace with your desired action
    router.push('/article');
  };

  const searchSize = size === 'large' ? 'text-2xl' : 'text-lg'
  const textSize = size === 'large' ? 'text-xl' : 'text-md';
  const subTextSize = size === 'large' ? 'text-sm' : 'text-xs';
  const imageSize = size === 'large' ? 'h-12 w-12' : 'h-8 w-8'
  const suggestSize = size === 'large' ? 'h-16' : 'h-10';
  const buttonSize = size === 'large' ? 'text-3xl' : 'text-xl';
  const padding = size === 'large' ? 'px-4 py-2' : 'px-2 py-1';

  return (
    <div className={`flex items-center max-w-xl ${padding} ${className}`}>
      <FaMagnifyingGlass className={`${buttonSize} text-gray-400 dark:text-white me-2`}/>
      <div className={`relative w-full ${padding}`}>
        <input
          type="text"
          value={query}
          onChange={handleInputChange}
          onKeyDown={handleKeyPress}
          placeholder="Type the name of your subject..."
          className={`${searchSize} w-full dark:bg-[#232323] px-1 py-2 text-gray-900 dark:text-white focus:outline-none placeholder:text-gray-400 dark:placeholder:text-white light:focus:border-b-gray-900 border-b-gray-200 border-b-2 transition duration-300`}
        />
        {suggestions.length > 0 && (
          <ul className="absolute z-10 bg-white dark:bg-[#232323] top-full left-0 w-full border border-gray-300 rounded-md shadow-md">
            {suggestions.map((suggestion, index) => (
              <li
                key={index}
                onClick={() => handleSubmit(suggestion.post.title)}
                className={`${padding} group hover:bg-[#232323] dark:hover:bg-white cursor-pointer`}
              >
                <div className={`flex items-center text-ellipsis ${suggestSize}`}>
                  <ImageWithFallback width={50} height={50}
                    imgSrc={suggestion.post.image.url} 
                    alt={suggestion.post.image.alt}
                    fallbackSrc="/blank-img.svg"
                    className={`${imageSize} object-contain dark:bg-white group-hover:bg-white rounded-3xl`}
                  />
                  <div className="ms-3 h-full overflow-hidden flex flex-col justify-center">
                    {/* <p className="text-gray-900 group-hover:text-white dark:text-white dark:group-hover:text-gray-900">
                      
                    </p> */}
                    <p className={`flex flex-col justify-center h-full text-gray-600 group-hover:text-gray-300 dark:text-gray-300 dark:group-hover:text-gray-600`}>
                      <span className={`${textSize} text-gray-900 group-hover:text-white dark:text-white dark:group-hover:text-gray-900`}>
                        {suggestion.post.title}
                      </span>
                      <span className={`${subTextSize} overflow-hidden hidden md:block`}>{suggestion.text}</span>
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
      <button className={`${buttonSize} text-gray-400 dark:text-white hover:text-gray-500 dark:hover:text-gray-400 transition duration-300 ms-1`}>
        <HiOutlineMicrophone />
      </button>
    </div>
  );
}
