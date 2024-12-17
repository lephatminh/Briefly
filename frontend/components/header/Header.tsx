'use client'
import { useState, useEffect } from "react";
import ThemeToggler from "./ThemeToggler";
import Navbar from "../navbar/Navbar";
import Logo from "../logo/Logo";

type Props = {
  className?: string,
  type?: 'logo' | 'navbar',
};

export default function Header({ type='navbar', className }: Props) {
  const [sticky, setSticky] = useState(false);
  
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
        <div className="flex p-2 items-center">
          <Logo className="me-5 w-10 h-10"/>
          <p className="text-[#232323] dark:text-white font-semibold tracking-wide text-xl">
            Briefly
          </p>
        </div>
      )}
      <ThemeToggler />
    </header>
  );
};