import Carousel from "@/components/carousel/Carousel";
import Article from "./Article";

const articleData = {
  "title": "Girls Band Cry",
  "content": "\"Girls Band Cry\" (ガールズバンドクライ Gāruzu Bando Kurai, abbreviated as ガルクラ GaruKura) is a multimedia project by Toei Animation. Led by ex-Sunrise producer Tadashi Hirayama and his colleagues from Love Live! Sunshine!!, director Kazuo Sakai and script writer Jukki Hanada. The project was revealed in April 2023[1] and started in May 29th with the release of 2 music videos Nameless Name and no rhyme nor reason by Togenashi Togeari. In the months leading up to the anime, 8 more music videos were released and the band performed at various music events and concerts. The anime premiered on Japanese TV and streaming from April 6th to June 29th, 2024.",
  "html": "\u003Ch1\u003EGirls Band Cry\u003C/h1\u003E\u003Cp\u003EGirls Band Cry is an anime.\u003C/p\u003E",
  'images': [
    {
      url: 'https://safebooru.org//images/772/f8635ab5e2c8767e732a508231606a14f078d826.jpg?5403098',
      alt: 'Girls Band Cry'
    }
  ],
  "created_at": "2024-12-06T12:12:40.594006+00:00",
  "updated_at": "2024-12-06T12:12:40.594006+00:00"
};

const images = [
  {
    url: 'https://upload.wikimedia.org/wikipedia/vi/2/2c/Nobita.png',
    alt: 'Girls Band Cry'
  },
];

export default function ArticlePage() {
  return (
    <main>
      <Article articleData={articleData} />
      <Carousel slides={images} />
    </main>
  );
};