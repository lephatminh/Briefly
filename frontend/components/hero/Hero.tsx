import Logo from "../logo/Logo";

type Props = {
  className?: string,
};

export default function Hero(props: Props) {
  return (
    <section className={`flex flex-col justify-center items-center ${props.className}`}>
      <Logo className="md:h-28 md:w-28 h-16 w-16"/>
      <h1 className="text-[#232323] dark:text-white md:text-8xl sm:text-7xl text-5xl font-semibold tracking-wide mt-2 line-through decoration-white dark:decoration-[#232323] decoration-4">
        Briefly
      </h1>
      <p className="text-[#232323] dark:text-white font-semibold md:text-2xl text-md mt-5">
        An AI-powered Wikipedia Assistant
      </p>
    </section>
  );
};