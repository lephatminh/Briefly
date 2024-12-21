'use client'
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArticleData } from "@/types/article";
import ImageWithFallback from "../image/ImageWithFallback";

type Props = {
  className?: string,
};

export default function Jumbotron({ className }: Props) {
  const router = useRouter();
  const [articleOtd, setArticleOtd] = useState<ArticleData | null>(null);
  
    const fetchArticleOtd = async () => {
      try {
        const response = await fetch(`https://briefly-sqwo.onrender.com/article`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        
        if (response.ok) {
          const data = await response.json();
          setArticleOtd(data || null);
        } else {
          console.error("Failed to fetch article of the day.")
        }
      } catch (error) {
        console.error("Error fetching article of the day:", error);
      }
    };
  
    useEffect(() => {
      fetchArticleOtd();
    }, []);
    
  return (
    <section className={`${className}`}>
      <h2 className="px-16 sm:text-left text-center text-2xl font-semibold text-[#232323] dark:text-white sm:mb-0 mb-4">
        Article of the day
      </h2>
      <div className="sm:flex sm:flex-row w-full sm:h-[450px] h-[570px] px-16 sm:py-12">
        {articleOtd && articleOtd.images.length > 0 && (
          <div className="relative sm:block flex justify-center sm:bg-gray-200 lg:w-[200px] lg:h-[200px] sm:w-[180px] sm:h-[180px] rounded-3xl sm:shadow-xl lg:pe-48 sm:pe-40 ">
            <ImageWithFallback
              imgSrc={articleOtd.images[0].url} 
              fallbackSrc="./blank-img.svg"
              alt={articleOtd.images[0].alt} 
              width={200} height={200} 
              className="sm:absolute top-10 left-10 sm:w-full sm:h-full w-[100px] h-[100px] bg-white rounded-3xl shadow-md object-fit"/>
          </div>
        )}
        <div className="flex flex-col mt-4 sm:ms-20 h-full">
          <p className="flex flex-col lg:h-[60%] h-1/2">
            <span className="text-xl sm:text-left text-center font-medium text-[#232323] dark:text-white mb-4">{articleOtd?.title}</span>
            <span className="text-md sm:text-left text-justify h-2/3 text-[#232323] dark:text-gray-50 overflow-hidden">{articleOtd?.content}</span>
          </p>
          <button onClick={() => router.push(`/article?id=${articleOtd?.id}`)}
            className="bg-[#232323] text-sm mx-auto sm:me-4 mt-3 hover:bg-white text-white hover:text-[#232323] hover:border-gray-300 dark:border-gray-300 border rounded-xl dark:hover:bg-[#232323] dark:bg-white dark:hover:text-white dark:text-[#232323] p-4 sm:w-fit w-full transition duration-300 font-medium">
            Read more
          </button>
        </div>
      </div>
    </section>
  );
};