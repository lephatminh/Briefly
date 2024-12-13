'use client'
import { useState } from "react";
import debounce from 'lodash/debounce'; // Import lodash debounce for better optimization
import { ArticleInterface } from "@/types/article";
import { FaMagnifyingGlass } from 'react-icons/fa6'
import { HiOutlineMicrophone } from 'react-icons/hi'

type Props = {
  size?: 'small' | 'large',
  className?: string,
};

export default function SearchBar({ size='large', className }: Props) {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<ArticleInterface[]>([]);
  const [loading, setLoading] = useState(false);
  const [cachedResults, setCachedResults] = useState<Record<string, ArticleInterface[]>>({}); // Cache for optimizing repeated queries

  // Debounced fetch function
  const fetchSuggestions = debounce(async (keyword: string) => {
    if (!keyword) {
      setSuggestions([]);
      setLoading(false);
      return;
    }

    // Check cache first
    if (cachedResults[keyword]) {
      setSuggestions(cachedResults[keyword]);
      setLoading(false);
      return;
    }

    setLoading(true);
    // try {
    //   const response = await fetch(`/api/search?search=${encodeURIComponent(keyword)}`);
    //   if (response.ok) {
    //     const data = await response.json();
    //     setSuggestions(data.posts || []);
    //     setCachedResults((prev) => ({ ...prev, [keyword]: data.posts || [] }));
    //   } else {
    //     console.error("Failed to fetch suggestions");
    //   }
    // } catch (error) {
    //   console.error("Error fetching suggestions:", error);
    // }
    const data = {
      posts: [
        {
          title: 'dalat',
          imgSrc: 'dalat',
          brief: 'dalat',
        },
        {
          title: 'saigon',
          imgSrc: 'saigon',
          brief: 'saigon',
        },
        {
          title: 'hue',
          imgSrc: 'hue',
          brief: 'hue',
        },
      ],
    };
    setSuggestions(data.posts || []);
    setCachedResults((prev) => ({ ...prev, [keyword]: data.posts || [] }))
    setLoading(false);
  }, 500);

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
    alert(`You selected: ${suggestion}`); // Replace with your desired action
    setQuery("");
    setSuggestions([]);
  };

  const textSize = size === 'large' ? 'text-2xl' : 'text-lg';
  const buttonSize = size === 'large' ? 'text-3xl' : 'text-xl';
  const padding = size === 'large' ? 'px-4 py-2' : 'px-2 py-1';

  return (
    <div className={`flex items-center max-w-lg w-full mx-auto ${padding} ${className}`}>
      <FaMagnifyingGlass className={`${textSize} text-gray-400 dark:text-white me-2`}/>
      <div className={`relative w-full ${textSize} ${padding}`}>
        <input
          type="text"
          value={query}
          onChange={handleInputChange}
          onKeyDown={handleKeyPress}
          placeholder="Type the name of your subject..."
          className="w-full dark:bg-[#232323] px-1 py-2 text-gray-900 dark:text-white focus:outline-none placeholder:text-gray-400 dark:placeholder:text-white light:focus:border-b-gray-900 border-b-gray-200 border-b-2 transition duration-300"
        />
        {suggestions.length > 0 && !loading && (
          <ul className="absolute z-10 bg-white dark:bg-[#232323] top-full left-0 w-full border border-gray-300 rounded-md shadow-md">
            {suggestions.map((suggestion, index) => (
              <li
                key={index}
                onClick={() => handleSubmit(suggestion.title)}
                className={`${padding} text-gray-900 hover:bg-gray-900 hover:text-white dark:text-white dark:hover:bg-white dark:hover:text-gray-900 cursor-pointer`}
              >
                {suggestion.title}
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
