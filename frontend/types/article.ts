export type ArticleInterface = {
    text: string,
    score: number,
    post: {
        title: string,
        image: {
            url: string,
            alt: string,
        },
    },
};

export type ArticleData = {
  title: string;
  content: string;
  images?: { url: string; alt: string }[];
  html: string;
  created_at: string;
  updated_at: string;
};