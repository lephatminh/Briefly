import Hero from "@/components/hero/Hero";
import SearchBar from "@/components/searchbar/SearchBar";
import Header from "@/components/header/Header";

export default function Home() {
  return (
    <div className="w-full h-[80vh] flex flex-col items-center justify-center">
      <Header />
      <Hero />
      <SearchBar className="mt-4"/>
    </div>
  );
};