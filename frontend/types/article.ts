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