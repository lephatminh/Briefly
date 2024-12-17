export type ArticleInterface = {
    title: string,
    imgSrc: string,
    brief: string,
};

export type ArticleData = {
  title: string;
  content: string;
  images?: { url: string; alt: string }[];
  html: string;
  created_at: string;
  updated_at: string;
};