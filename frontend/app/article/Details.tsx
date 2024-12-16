import he from "he";

type DetailsProps = {
  htmlContent: string;
  createdAt: string;
  updatedAt: string;
  // images?: { url: string; alt: string }[];
};

export default function Details({ htmlContent, createdAt, updatedAt, /* images = [] */}: DetailsProps) {
  const decodedHtml = he.decode(htmlContent);
  console.log(decodedHtml);
  return (
    <div className="prose lg:prose-xl dark:prose-invert">
      <div dangerouslySetInnerHTML={{ __html: decodedHtml }} />
      
      {/* Render images
      {images.length > 0 && (
        <div className="mt-4">
          {images.map((img, index) => (
            <img
              key={index}
              src={img.url}
              alt={img.alt}
              className="w-full h-auto rounded shadow"
            />
          ))}
        </div>
      )} */}
      
      {/* Render timestamps */}
      <div className="text-sm text-gray-600 mt-4">
        <p>Created at: {new Date(createdAt).toLocaleString()}</p>
        <p>Updated at: {new Date(updatedAt).toLocaleString()}</p>
      </div>
    </div>
  );
}
