import Image from "next/image";
import Hero from "@/components/hero/Hero";
import SearchBar from "@/components/searchbar/SearchBar";
import Header from "@/components/header/Header";

export default function Home() {
  return (
    <div className="w-full h-screen relative overflow-hidden">
      <Header />
      <main className="h-screen flex flex-col items-center justify-center">
        <Hero />
        <SearchBar className="mt-4 md:w-1/2"/>
      </main>
      <Image src={'/wiki.svg'} alt="wiki" width={100} height={100} className="absolute lg:rotate-0 md:-rotate-[14deg] md:-right-1/3 -right-1/4 md:top-1/3 top-1/2 h-full w-full md:h-[150%] md:w-[150%]"/>
    </div>
  );
};