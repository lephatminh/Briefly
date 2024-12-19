import Hero from "@/components/hero/Hero";
import SearchBar from "@/components/searchbar/SearchBar";
import Header from "@/components/header/Header";
import Footer from "@/components/footer/Footer";
import ThemeCardGroup from "@/components/card/ThemeGroup";
import Jumbotron from "@/components/jumbotron/Jumbotron";

export default function Home() {
  return (
    <div className="w-full h-full relative overflow-hidden">
      <Header />
      <main className="h-screen flex flex-col items-center justify-center">
        <Hero />
        <SearchBar className="mt-4 md:w-1/2"/>
      </main>
      <Jumbotron className="lg:px-32 sm:px-20 px-1 py-12"/>
      <ThemeCardGroup />
      <Footer />
    </div>
  );
};
