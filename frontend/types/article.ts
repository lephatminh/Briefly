export type ArticleInterface = {
    text: string,
    score: number,
    post: {
        id: number,
        title: string,
        image: ArticleImage,
    },
};

export type ArticleImage = {
    url: string;
    alt: string;    
};

export type ArticleData = {
    id: number,
    title: string;
    content: string;
    images: ArticleImage[];
    html: string;
    created_at: string;
    updated_at: string;
};