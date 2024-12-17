export type ArticleInterface = {
    text: string,
    score: number,
    post: {
        title: string,
        image: ArticleImage,
    },
};

export type ArticleImage = {
    url: string;
    alt: string;    
};

export type ArticleData = {
  title: string;
  content: string;
  images: ArticleImage[];
  html: string;
  created_at: string;
  updated_at: string;
};