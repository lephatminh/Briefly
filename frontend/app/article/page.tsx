"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Details from "./Details";
import Summary from "./Summary";

const articleData = {
  "title": "Girls Band Cry",
  "content": "\"Girls Band Cry\" (ガールズバンドクライ Gāruzu Bando Kurai, abbreviated as ガルクラ GaruKura) is a multimedia project by Toei Animation. Led by ex-Sunrise producer Tadashi Hirayama and his colleagues from Love Live! Sunshine!!, director Kazuo Sakai and script writer Jukki Hanada. The project was revealed in April 2023[1] and started in May 29th with the release of 2 music videos Nameless Name and no rhyme nor reason by Togenashi Togeari. In the months leading up to the anime, 8 more music videos were released and the band performed at various music events and concerts. The anime premiered on Japanese TV and streaming from April 6th to June 29th, 2024.",
  "html": "\u003Ch1\u003EGirls Band Cry\u003C/h1\u003E\u003Cp\u003EGirls Band Cry is an anime.\u003C/p\u003E\u003Cimg src=\"https://safebooru.org//images/772/f8635ab5e2c8767e732a508231606a14f078d826.jpg?5403098\" alt = \"Girls Band Cry\"\u003E",
  "created_at": "2024-12-06T12:12:40.594006+00:00",
  "updated_at": "2024-12-06T12:12:40.594006+00:00"
};

// export default function Article() {
//   return (
//     <div className="m-2">
//       <h1 className="text-2xl font-bold">Article</h1>
//     </div>
//   );
// };

interface ArticleData {
  title: string;
  content: string;
  images?: { url: string; alt: string }[];
  html: string;
  created_at: string;
  updated_at: string;
}

export default function Article() {
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("search"); // Extract query parameter
  // const [articleData, setArticleData] = useState<ArticleData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<"details" | "summary">("details");

  // useEffect(() => {
  //   const fetchArticleData = async () => {
  //     if (!searchQuery) return;

  //     setLoading(true);
  //     try {
  //       const response = await fetch(`http://127.0.0.1:8000/articles?search=${encodeURIComponent(searchQuery)}`);
  //       if (response.ok) {
  //         const data: ArticleData = await response.json();
  //         setArticleData(data);
  //       } else {
  //         console.error("Failed to fetch article data");
  //       }
  //     } catch (error) {
  //       console.error("Error fetching article data:", error);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchArticleData();
  // }, [searchQuery]);

  // if (loading) return <p className="text-center mt-4">Loading...</p>;
  // if (!articleData) return <p className="text-center mt-4">No article found.</p>;

  return (
    <div className="w-[800px] max-h-screen mx-auto">
      {/* <h1 className="text-2xl font-bold p-4 border-b">{articleData.title}</h1> */}
      {/* Tabs */}
      <div className="flex items-center mt-4 justify-left space-x-8">
        {/* Details Tab */}
        <button
          onClick={() => setActiveTab("details")}
          className={`text-center w-[90px] h-[32px] flex items-center justify-center ${
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
          className={`text-center w-[90px] h-[32px] flex items-center justify-center ${
            activeTab === "summary"
              ? "text-xl text-gray-800 dark:text-white font-bold"
              : "text-gray-500 dark:text-gray-400 font-medium"
          }`}
        >
          Summary
        </button>

      </div>


    <div className="flex items-center mt-4 justify-end text-sm text-gray-500 bg-gray-50 dark:bg-gray-600">
      {new Date(articleData.created_at).toLocaleDateString("en-GB")}
    </div>
      
      {/* Content */}
      <div className="bg-gray-50 dark:bg-gray-600">
        {activeTab === "details" ? (
          <Details
            htmlContent={articleData.html}
            // createdAt={articleData.created_at}
            // updatedAt={articleData.updated_at}
            // images={articleData.images}
          />
        ) : (
          <Summary summary={articleData.content} />
        )}
      </div>
    </div>
  );
}