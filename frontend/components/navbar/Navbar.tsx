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
    <div className={`flex flex-col sm:flex-row sm:justify-between text-sm ${props.className}`}>
      {/* Menu Button (Visible on Small Screens) */}
      <button
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        className="sm:hidden text-gray-900 dark:text-white text-xl px-4 py-2 rounded-md mb-2"
      >
        {isMenuOpen ? <RiCloseLine /> : <RiMenu2Fill />}
      </button>

      {/* Links (Hidden on small screens by default) */}
      <div
        className={`${
          isMenuOpen ? 'flex absolute top-16 left-8' : 'hidden'
        } sm:flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 rounded-md sm:border-none dark:border-gray-300 dark:border sm:shadow-none shadow-md`}
      >
        <Link
          href="#"
          className="sm:border-none text-gray-900 dark:text-white px-2 py-1 sm:py-0 sm:border-r-2 sm:border-r-gray-600"
        >
          Donate
        </Link>
        <Link
          href="#"
          className="sm:border-none text-gray-900 dark:text-white px-2 py-1 sm:py-0 sm:border-r-2 sm:border-r-gray-600"
        >
          About
        </Link>
        <Link
          href="#"
          className="sm:border-none text-gray-900 dark:text-white px-2 py-1 sm:py-0 sm:border-r-2 sm:border-r-gray-600"
        >
          Privacy Policy
        </Link>
        <Link href="#" className="text-gray-900 dark:text-white px-2 py-1 sm:py-0">
          Contact Us
        </Link>
      </div>
    </div>
  );
};
