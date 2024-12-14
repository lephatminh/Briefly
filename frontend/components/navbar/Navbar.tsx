import Link from "next/link";

type Props = {
  className?: string
};

export default function Navbar(props: Props) {
  return (
    <div className={`flex text-sm ${props.className}`}>
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
  )
}