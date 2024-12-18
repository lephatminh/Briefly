'use client'
import { useState, useEffect } from "react";
import Jumbotron from "./Jumbotron";
import { ArticleData } from "@/types/article";

type Props = {
  className?: string,
};

export default function ArticleOfTheDay({ className }: Props) {
  const [articleOtd, setArticleOtd] = useState<ArticleData | null>(null);

  const fetchArticleOtd = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/search/article`, {
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

  return articleOtd && (
    <Jumbotron 
      section="Article of the day"
      title={articleOtd.title}
      content={articleOtd.content}
      image={articleOtd.images[0].url}
      alt={articleOtd.images[0].alt}
      className={className}
    />
  );
};