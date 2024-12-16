type SummaryProps = {
    summary: string;
  };
  
  export default function Summary({ summary }: SummaryProps) {
    return (
      <div className="prose lg:prose-xl dark:prose-invert w-[701px] h-[957px] overflow-auto">
        <p className="text-lg text-gray-800 dark:text-white">{summary}</p>
      </div>
    );
  }
  