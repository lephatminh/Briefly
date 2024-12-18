'use client'
import { useState, useEffect } from "react";
import { IoIosSearch, IoIosCloseCircleOutline } from "react-icons/io";
import { Dialog } from "@headlessui/react";
import ThemeToggler from "./ThemeToggler";
import Navbar from "../navbar/Navbar";
import Logo from "../logo/Logo";
import SearchBar from "../searchbar/SearchBar";
import Link from "next/link";

type Props = {
  className?: string,
  type?: 'logo' | 'navbar',
};

export default function Header({ type='navbar', className }: Props) {
  const [sticky, setSticky] = useState(false);
  const [searchBarVisible, setSearchBarVisisble] = useState(false);
  
  useEffect(() => {
    window.addEventListener("scroll", handleStickyNavbar);
  });

  const handleStickyNavbar = () => {
    if (window.scrollY >= 80) {
      setSticky(true);
    } else {
      setSticky(false);
    }
  };
  return (
    <header className={`${className} left-0 top-0 z-50 flex w-full items-center justify-between px-4 py-2 ${
      sticky
        ? "dark:bg-gray-dark dark:shadow-sticky-dark fixed z-[9999] bg-white dark:bg-[#232323] !bg-opacity-80 shadow-sticky backdrop-blur-sm transition"
        : "absolute bg-transparent"
    }`}>
      {type === 'navbar' ? (
        <Navbar className="p-2" />
      ) : (
        <Link href={'/'} className="flex p-2 items-center">
          <Logo className="me-5 w-10 h-10"/>
          <p className="text-[#232323] dark:text-white font-semibold tracking-wide text-xl">
            Briefly
          </p>
        </Link>
      )}
      <div className="flex justify-end space-x-2">
        <button onClick={() => setSearchBarVisisble(true)} className="text-2xl">
          <IoIosSearch />
        </button>
        <ThemeToggler />
      </div>
      <Dialog
        open={searchBarVisible}
        onClose={() => setSearchBarVisisble(false)}
        className='fixed inset-0 flex flex-col items-center justify-start w-screen h-screen backdrop-blur-xl z-50'
      >
        <button className="rounded-full p-8 mt-16 text-4xl text-gray-400 dark:text-gray-300" onClick={() => setSearchBarVisisble(false)}>
          <IoIosCloseCircleOutline />
        </button>
        <div className="w-full h-fit px-6 flex justify-center rounded-2xl">
          <SearchBar className='w-full bg-white dark:bg-[#232323] rounded-xl shadow-md'/>
        </div>
      </Dialog>
    </header>
  );
};