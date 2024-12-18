import Header from "@/components/header/Header";
import Footer from "@/components/footer/Footer";
import Article from "./Article";

export default function ArticlePage() {
  return (
    <div className="max-w-full">
      <Header type="logo"/>
      <Article className="mt-32"/>
      <Footer />
    </div>
  );
};