import ThemeCard from "./ThemeCard";
import { LuLandmark } from "react-icons/lu";
import { HiOutlineChip } from 'react-icons/hi'
import { PiDna, PiSoccerBallLight, PiPalette } from "react-icons/pi";
import { CiStethoscope } from "react-icons/ci";

export default function ThemeCardGroup() {
  return (
    <div className="py-16 lg:px-48 sm:px-36 px-8 w-full">
      <h2 className="text-2xl sm:text-left text-center font-semibold text-[#232323] dark:text-white">
        Categories
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 py-12">
        {/* Technologie Card */}
        <ThemeCard
          Icon={HiOutlineChip}
          theme="Technology"
          figure={6790}
          unit="articles"
        />

        {/* Science Card */}
        <ThemeCard
          Icon={PiDna}
          theme="Science"
          figure={2250}
          unit="articles"
        />

        {/* Medecine Card */}
        <ThemeCard
          Icon={CiStethoscope}
          theme="Medicine"
          figure={1054}
          unit="articles"
        />

        {/* Sports Card */}
        <ThemeCard
          Icon={PiSoccerBallLight}
          theme="Sports"
          figure="20K"
          unit="articles"
        />

        {/* Arts Card */}
        <ThemeCard
          Icon={PiPalette}
          theme="Arts"
          figure={7800}
          unit="articles"
        />

        {/* Politique Card */}
        <ThemeCard
          Icon={LuLandmark}
          theme="Politics"
          figure="12K"
          unit="articles"
        />
      </div>
    </div>
  );
};