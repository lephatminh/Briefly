import Header from "@/components/header/Header";
import Footer from "@/components/footer/Footer";
import Article from "./Article";
import { Suspense } from "react";

export default function ArticlePage() {
  return (
    <div className="max-w-full">
      <Header type="logo"/>
      <Suspense>
        <Article className="mt-32"/>
      </Suspense>
      <Footer />
    </div>
  );
};