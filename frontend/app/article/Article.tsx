"use client";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { ArticleData } from "@/types/article";
import ImageWithFallback from "@/components/image/ImageWithFallback";
import Carousel from "@/components/carousel/Carousel";
import Details from "./Details";
import Summary from "./Summary";

type Props = {
  className?: string,
}

export default function Article({ className }: Props) {
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("id");
  const [articleData, setArticleData] = useState<ArticleData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<"details" | "summary">("details");

  useEffect(() => {
    const fetchArticleData = async () => {
      if (!searchQuery) return;

      setLoading(true);
      try {
        const response = await fetch(`http://127.0.0.1:8000/search/article?id=${encodeURIComponent(searchQuery)}`);
        if (response.ok) {
          const data: ArticleData = await response.json();
          setArticleData(data);
        } else {
          console.error("Failed to fetch article data");
        }
      } catch (error) {
        console.error("Error fetching article data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchArticleData();
  }, [searchQuery]);

  if (loading) return <p className="text-center mt-4">Loading...</p>;
  if (!articleData) return <p className="text-center mt-4">No article found.</p>;

  return (
    <div className={`max-w-full overflow-hidden ${className}`}>
      {/* Tabs */}
      <h1 className="text-5xl tracking-wide text-center font-bold mb-8">{articleData.title}</h1>
      <section className="flex justify-around sm:space-x-6 p-4 sm:p-16 h-[1200px]">
        <div className="flex flex-col items-center mt-5">
          <div className="mb-4">
            <ImageWithFallback 
              imgSrc={articleData.images[0].url} 
              fallbackSrc='/blank-img.svg'
              alt={articleData.images[0].alt} 
              width={200} height={200} 
              className="object-contain lg:w-72 lg:h-72 w-48 h-48 dark:bg-gray-500" 
            />
            <p className="text-gray-500 dark:text-gray-300 mt-1 text-center">{articleData.images[0].alt}</p>
          </div>
          {articleData.images.length > 1 && <Carousel slides={articleData.images.slice(1, Math.floor(articleData.images.length / 2) + 1)} className="my-4" />}
          {articleData.images.length > 2 && <Carousel slides={articleData.images.slice(Math.floor(articleData.images.length / 2) + 1)} className="my-4" />}
        </div>
        <div>
          <div className="flex items-center justify-between w-full my-4">
            <div className="flex space-x-8">
              <button
                onClick={() => setActiveTab("details")}
                className={`text-center w-1/2 h-[32px] flex items-center justify-center ${
                  activeTab === "details"
                    ? "text-xl text-gray-800 dark:text-white font-bold"
                    : "text-gray-500 dark:text-gray-400 font-medium"
                }`}
              >
                Details
              </button>
              <span className="text-lg text-gray-800 dark:text-white">|</span>
              <button
                onClick={() => setActiveTab("summary")}
                className={`text-center w-1/2 h-[32px] flex items-center justify-center ${
                  activeTab === "summary"
                    ? "text-xl text-gray-800 dark:text-white font-bold"
                    : "text-gray-500 dark:text-gray-400 font-medium"
                }`}
              >
                Summary
              </button>
            </div>
            <p className="text-end text-sm text-gray-500 dark:text-gray-300 px-4">
              {new Date(articleData.created_at).toLocaleDateString("en-GB")}
            </p>
          </div>
          {/* Content */}
          <div className="bg-gray-100 dark:bg-slate-700 p-4 rounded-2xl w-full h-[1100px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 dark:scrollbar-thumb-[#3e3e3e] dark:scrollbar-track-[#232323] shadow-md">
            {activeTab === "details" ? (
              <Details
                htmlContent={articleData.html}
              />
            ) : (
              <Summary summary={articleData.content} />
            )}
          </div>
        </div>
      </section>
    </div>
  );
};