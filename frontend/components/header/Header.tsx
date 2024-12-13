'use client'
import { useState, useEffect } from "react";
import Link from "next/link";
import ThemeToggler from "./ThemeToggler";

type Props = {
  className?: string,
};

export default function Header(props: Props) {
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
    <header className={`${props.className} left-0 top-0 z-50 flex w-full items-center justify-between ${
      sticky
        ? "dark:bg-gray-dark dark:shadow-sticky-dark fixed z-[9999] bg-white !bg-opacity-80 shadow-sticky backdrop-blur-sm transition"
        : "absolute bg-transparent"
    }`}>
      <div className="flex text-sm p-2">
        <Link href='#' className="border-r-2 border-r-gray-600 dark:border-r-white text-gray-900 dark:text-white px-2">
          <p>Donate</p>
        </Link>
        <Link href='#' className="border-r-2 border-r-gray-600 dark:border-r-white text-gray-900 dark:text-white px-2">
          <p>About</p>
        </Link>
        <Link href='#' className="border-r-2 border-r-gray-600 dark:border-r-white text-gray-900 dark:text-white px-2">
          <p>Privacy Policy</p>
        </Link>
        <Link href='#' className="text-gray-900 dark:text-white px-2">
          <p>Contact Us</p>
        </Link>
      </div>
      <ThemeToggler />
    </header>
  );
};