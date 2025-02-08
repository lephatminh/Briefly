import he from "he";

type DetailsProps = {
  htmlContent: string;
};

export default function Details({ htmlContent/* , createdAt, updatedAt, images = [] */}: DetailsProps) {
  const decodedHtml = he.decode(htmlContent);
  // console.log(decodedHtml);
  return (
    <div className="prose lg:prose-xl dark:prose-invert w-full overflow-x-scroll overflow-y-auto rounded-md p-3">
      <div dangerouslySetInnerHTML={{ __html: decodedHtml }} />
    </div>
  );
}
