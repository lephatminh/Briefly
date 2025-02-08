"use client";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { ArticleData } from "@/types/article";
import ImageWithFallback from "@/components/image/ImageWithFallback";
import Carousel from "@/components/carousel/Carousel";
import Details from "./Details";
import Summary from "./Summary";
import Chatbot from "./Chatbot";

type Props = {
  className?: string,
}

export default function Article({ className }: Props) {
  const searchParams = useSearchParams();
  const articleId = searchParams.get("id");
  const [articleData, setArticleData] = useState<ArticleData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<"details" | "summary" | "Q&A">("details");
  const [summary, setSummary] = useState("");

  useEffect(() => {
    const fetchArticleData = async () => {
      if (!articleId) return;

      setLoading(true);
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_DEPLOY}/article?id=${encodeURIComponent(articleId)}`);
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

    const fetchSummary = async () => {
      if (!articleId) return;

      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_DEPLOY}/article/summary?id=${encodeURIComponent(articleId)}`);
        if (response.ok) {
          const data = await response.json();
          setSummary(data.summary);
        } else {
          console.error("Failed to fetch article summary.")
        }
      } catch (error) {
        console.error("Error fetching article summary: ", error);
      }
    };

    fetchArticleData();
    fetchSummary();

  }, [articleId]);

  if (loading) return <p className="text-center mt-4">Loading...</p>;
  if (!articleData) return <p className="text-center mt-4">No article found.</p>;

  return (
    <div className={`max-w-full overflow-hidden ${className}`}>
      {/* Tabs */}
      <h1 className="sm:text-5xl text-4xl tracking-wide text-center font-bold mb-8 p-4">{articleData.title}</h1>
      <section className="flex md:flex-row flex-col justify-around sm:space-x-6 p-4 sm:p-16">
        {articleData.images.length > 0 && 
          <div className="hidden md:flex flex-col items-center mt-5">
            <div className="flex-shrink-0 flex flex-col bg-gray-100 dark:bg-gray-500 p-3 rounded-xl lg:w-72 w-48">
              <ImageWithFallback 
                imgSrc={articleData.images[0].url} 
                fallbackSrc='/blank-img.svg'
                alt={articleData.images[0].alt} 
                width={200} height={200} 
                className="object-contain lg:w-72 lg:h-72 w-48 h-48" 
              />
              <p className="mt-2 text-center text-sm text-gray-500 dark:text-gray-300 font-medium">{articleData.images[0].alt}</p>
            </div>
            {articleData.images.length > 1 && <Carousel slides={articleData.images.slice(1, Math.floor(articleData.images.length / 2) + 1)} className="my-4" />}
            {articleData.images.length > 2 && <Carousel slides={articleData.images.slice(Math.floor(articleData.images.length / 2) + 1)} className="my-4" />}
          </div>
        }
        {articleData.images.length > 0 && 
          <div className="md:hidden flex justify-center items-center my-5">
            <Carousel slides={articleData.images} className="my-4" />
          </div>
        }
        <div className="w-full">
          <div className="flex items-center justify-between w-full my-4">
            <div className="flex space-x-8">
              <button
                onClick={() => setActiveTab("details")}
                className={`text-center w-1/3 h-[32px] flex items-center justify-center ${
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
                className={`text-center w-1/3 h-[32px] flex items-center justify-center ${
                  activeTab === "summary"
                    ? "text-xl text-gray-800 dark:text-white font-bold"
                    : "text-gray-500 dark:text-gray-400 font-medium"
                }`}
              >
                Summary
              </button>
              <span className="text-lg text-gray-800 dark:text-white">|</span>
              <button
                onClick={() => setActiveTab("Q&A")}
                className={`text-center w-1/3 h-[32px] flex items-center justify-center ${
                  activeTab === "Q&A"
                    ? "text-xl text-gray-800 dark:text-white font-bold"
                    : "text-gray-500 dark:text-gray-400 font-medium"
                }`}
              >
                Q&A
              </button>
            </div>
            <p className="hidden sm:block text-end text-sm text-gray-500 dark:text-gray-300 px-4">
              {new Date(articleData.created_at).toLocaleDateString("en-GB")}
            </p>
          </div>
          {/* Content */}
          <div className="bg-gray-100 dark:bg-slate-700 p-4 rounded-2xl w-full md:w-[470px] lg:w-[600px] xl:w-full sm:h-[1200px] overflow-y-auto overflow-x-scroll scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 dark:scrollbar-thumb-[#3e3e3e] dark:scrollbar-track-[#232323] shadow-md">
            {activeTab === "details" && <Details htmlContent={articleData.html}/>}
            {activeTab === "summary" &&<Summary summary={summary || 'Loading summary...'} />}
            <Chatbot articleId={articleId || ""} className={`${activeTab !== "Q&A" && "hidden"}`} />
          </div>
        </div>
      </section>
    </div>
  );
};