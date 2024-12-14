import Logo from "../logo/Logo";

type Props = {
  className?: string,
};

export default function Hero(props: Props) {
  return (
    <section className={`flex flex-col justify-center items-center ${props.className}`}>
      <Logo className="h-20 w-20"/>
      <h1 className="text-[#232323] dark:text-white text-7xl font-semibold tracking-wide mt-2 line-through decoration-white dark:decoration-[#232323] decoration-4">
        Briefly
      </h1>
      <p className="text-[#232323] dark:text-white font-semibold text-lg mt-4">
        An AI-powered Wikipedia Assistant
      </p>
    </section>
  );
};