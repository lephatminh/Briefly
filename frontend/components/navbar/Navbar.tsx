'use client'
import { useState, useEffect } from 'react';
import { RiMenu2Fill, RiCloseLine } from "react-icons/ri";
import Link from 'next/link';

interface Props {
  className?: string;
}

export default function Navbar(props: Props) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 640) {
        setIsMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);

    // Cleanup listener on unmount
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div className={`flex flex-col md:[@media(min-height:600px)]:flex-row md:[@media(min-height:600px)]:justify-between text-sm ${props.className}`}>
      {/* Menu Button (Visible on Small Screens) */}
      <button
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        className="md:[@media(min-height:600px)]:hidden text-gray-900 dark:text-white text-xl px-4 py-2 rounded-md mb-2"
      >
        {isMenuOpen ? <RiCloseLine /> : <RiMenu2Fill />}
      </button>

      {/* Links (Hidden on small screens by default) */}
      <div
        className={`${
          isMenuOpen ? 'flex absolute top-16 left-8' : 'hidden'
        } md:[@media(min-height:600px)]:flex flex-col md:[@media(min-height:600px)]:flex-row space-y-2 md:[@media(min-height:600px)]:space-y-0 md:[@media(min-height:600px)]:space-x-4 rounded-md md:[@media(min-height:600px)]:border-none dark:border-gray-300 dark:border md:[@media(min-height:600px)]:shadow-none shadow-md`}
      >
        <Link
          href="#"
          className="md:[@media(min-height:600px)]:border-none text-gray-900 dark:text-white px-2 py-1 md:[@media(min-height:600px)]:py-0 md:[@media(min-height:600px)]:border-r-2 md:[@media(min-height:600px)]:border-r-gray-600"
        >
          Donate
        </Link>
        <Link
          href="#"
          className="md:[@media(min-height:600px)]:border-none text-gray-900 dark:text-white px-2 py-1 md:[@media(min-height:600px)]:py-0 md:[@media(min-height:600px)]:border-r-2 md:[@media(min-height:600px)]:border-r-gray-600"
        >
          About
        </Link>
        <Link
          href="#"
          className="md:[@media(min-height:600px)]:border-none text-gray-900 dark:text-white px-2 py-1 md:[@media(min-height:600px)]:py-0 md:[@media(min-height:600px)]:border-r-2 md:[@media(min-height:600px)]:border-r-gray-600"
        >
          Privacy Policy
        </Link>
        <Link href="#" className="text-gray-900 dark:text-white px-2 py-1 md:[@media(min-height:600px)]:py-0">
          Contact Us
        </Link>
      </div>
    </div>
  );
};
