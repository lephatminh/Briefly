import React from "react";

type Props = {
  Icon: React.ComponentType; // Icon Component
  theme: string; // Theme Title
  figure: number | string; // Figure Value
  unit?: string; // Optional unit, e.g., 'articles'
};

export default function ThemeCard({ Icon, theme, figure, unit }: Props) {
  return (
    <div className="flex items-center border rounded-lg shadow-sm overflow-hidden w-full">
      {/* Left Section: Icon and Theme */}
      <div className="flex flex-col items-center justify-center w-1/2 p-4 border-r bg-gray-50 dark:bg-[#232323]">
        <div className="text-4xl text-gray-700 dark:text-white mb-2">
          <Icon />
        </div>
        <div className="text-sm font-medium text-gray-600 dark:text-white">{theme}</div>
      </div>
      {/* Right Section: Figure and Unit */}
      <div className="flex flex-col justify-center items-start w-1/2 px-4">
        <div className="text-3xl font-bold text-gray-900 dark:text-white">{figure}</div>
        {unit && <div className="text-sm text-gray-500 dark:text-gray-300">{unit}</div>}
      </div>
    </div>
  );
};
