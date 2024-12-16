type SummaryProps = {
    summary: string;
  };
  
  export default function Summary({ summary }: SummaryProps) {
    return (
      <div className="p-4">
        <p className="text-lg text-gray-800 dark:text-white">{summary}</p>
      </div>
    );
  }
  