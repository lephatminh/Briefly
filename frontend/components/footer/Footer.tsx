import Logo from "../logo/Logo";

type Props = {
  className?: string,
};

export default function Footer(props: Props) {
  return (
    <footer className={`flex flex-col justify-center items-center mt-20 mb-8 ${props.className}`}>
      <Logo className='h-10 w-10 mb-4'/>
      <p className="text-gray-500 dark:text-gray-400 text-sm">© 2025 Briefly. All Rights Reserved.</p>
    </footer>
  );
};