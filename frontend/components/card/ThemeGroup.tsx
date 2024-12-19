import ThemeCard from "./ThemeCard";
import { HiOutlineChip } from 'react-icons/hi'
import { TbAtom, TbMath, TbSettingsCog } from "react-icons/tb";
import { LuBrainCircuit, LuClipboardList } from "react-icons/lu";

export default function ThemeCardGroup() {
  return (
    <div className="py-16 lg:px-48 sm:px-36 px-8 w-full">
      <h2 className="text-2xl sm:text-left text-center font-semibold text-[#232323] dark:text-white">
        Features
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 py-12">
        <ThemeCard
          Icon={LuBrainCircuit}
          theme="AI"
          figure={'300+'}
          unit="articles"
        />
        <ThemeCard
          Icon={HiOutlineChip}
          theme="Computer Science"
          figure={'200+'}
          unit="articles"
        />
        <ThemeCard
          Icon={TbAtom}
          theme="Physics"
          figure={'300+'}
          unit="articles"
        />
        <ThemeCard
          Icon={TbSettingsCog}
          theme="Engineering"
          figure={'1000+'}
          unit="articles"
        />
        <ThemeCard
          Icon={TbMath}
          theme="Mathematics"
          figure="300+"
          unit="articles"
        />
        <ThemeCard
          Icon={LuClipboardList}
          theme="Summarization"
          figure="2000+"
          unit="AI Summary"
        />
      </div>
    </div>
  );
};