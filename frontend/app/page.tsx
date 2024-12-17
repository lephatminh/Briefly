import Hero from "@/components/hero/Hero";
import SearchBar from "@/components/searchbar/SearchBar";
import Header from "@/components/header/Header";
import Jumbotron from "@/components/jumbotron/Jumbotron";
import Footer from "@/components/footer/Footer";
import ThemeCardGroup from "@/components/card/ThemeGroup";

export default function Home() {
  return (
    <div className="w-full h-full relative overflow-hidden">
      <Header />
      <main className="h-screen flex flex-col items-center justify-center">
        <Hero />
        <SearchBar className="mt-4 md:w-1/2"/>
      </main>
      <Jumbotron 
        section="Article of the day"
        title="Python"
        content="Python was conceived in the late 1980s[41] by Guido van Rossum at Centrum Wiskunde & Informatica (CWI) in the Netherlands as a successor to the ABC programming language, which was inspired by SETL,[42] capable of exception handling and interfacing with the Amoeba operating system.[12] Its implementation began in December 1989."
        image="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c3/Python-logo-notext.svg/242px-Python-logo-notext.svg.png"
        alt="python"
        className="lg:px-32 sm:px-20 px-1 py-12"
        />
      <ThemeCardGroup />
      <Footer />
    </div>
  );
};
