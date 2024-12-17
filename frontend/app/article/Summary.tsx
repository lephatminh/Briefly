type SummaryProps = {
    summary: string;
  };
  
  export default function Summary({ summary }: SummaryProps) {
    return (
      <div className="prose lg:prose-xl dark:prose-invert w-[800px] max-h-screen overflow-auto rounded-md py-3 pl-5 pr-16 no-scrollbar">
        <p>{summary}</p>
      </div>
    );
  }
  