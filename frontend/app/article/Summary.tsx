type SummaryProps = {
    summary: string;
  };
  
  export default function Summary({ summary }: SummaryProps) {
    return (
      <div className="prose lg:prose-xl dark:prose-invert w-full max-h-screen overflow-auto rounded-md p-3">
        <p>{summary}</p>
      </div>
    );
  }
  