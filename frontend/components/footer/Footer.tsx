import Logo from "../logo/Logo";
import Navbar from "../navbar/Navbar";

type Props = {
  className?: string,
};

export default function Footer(props: Props) {
  return (
    <footer className={`flex flex-col justify-center items-center ${props.className}`}>
      <Logo className='h-10 w-10 mb-4'/>
      <Navbar />
    </footer>
  );
};