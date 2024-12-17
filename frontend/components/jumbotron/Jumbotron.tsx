import Image from "next/image";

type Props = {
  section: string,
  title: string,
  content: string,
  image?: string,
  alt?: string,
  className?: string,
};

export default function Jumbotron(props: Props) {
  const { section, title, content, image, alt, className } = props
  return (
    <section className={`${className}`}>
      <h2 className="px-16 sm:text-left text-center text-2xl font-semibold text-[#232323] dark:text-white sm:mb-0 mb-4">
        {section}
      </h2>
      <div className="sm:flex sm:flex-row w-full sm:h-[450px] h-[570px] px-16 sm:py-12 justify-center">
        {image && alt && (
          <div className="relative sm:block flex justify-center sm:bg-gray-200 lg:w-[200px] lg:h-[200px] sm:w-[180px] sm:h-[180px] rounded-3xl sm;shadow-xl lg:pe-48 sm:pe-40">
            <Image src={image} alt={alt} width={200} height={200} className="sm:absolute top-10 left-10 sm:w-full sm:h-full w-[100px] h-[100px] bg-white rounded-3xl shadow-md"/>
          </div>
        )}
        <div className="flex flex-col items-end mt-4 sm:ms-20">
          <p className="flex flex-col lg:h-[60%] h-1/2">
            <span className="text-xl sm:text-left text-center font-medium text-[#232323] dark:text-white mb-4">{title}</span>
            <span className="text-md sm:text-left text-justify h-2/3 text-[#232323] dark:text-gray-50 overflow-hidden">{content}</span>
          </p>
          <button className="bg-[#232323] mx-auto sm:me-4 mt-3 hover:bg-white text-white hover:text-[#232323] hover:border-gray-300 dark:border-gray-300 border rounded-xl dark:hover:bg-[#232323] dark:bg-white dark:hover:text-white dark:text-[#232323] lg:p-4 sm:p-2 py-3 px-16 transition duration-300 font-medium">
            Read more
          </button>
        </div>
      </div>
    </section>
  );
};


// export default function Jumbotron(props: Props) {
//   const { section, title, content, image, alt, className } = props
//   return (
//     <section className={`${className}`}>
//       <h2 className="px-16 text-2xl sm:text-left text-center font-semibold text-[#232323] dark:text-white mb-2">
//         {section}
//       </h2>
//       <div className="sm:flex sm:flex-row w-full sm:h-[450px] h-[480px] px-16 sm:py-12 justify-center">
//         {image && alt && (
//           <div className="sm:relative sm:block flex justify-center sm:bg-gray-200 lg:w-[200px] lg:h-[200px] sm:w-[180px] sm:h-[180px] rounded-3xl sm:shadow-xl lg:pe-48 sm:pe-40">
//             <Image src={image} alt={alt} width={200} height={200} className="sm:absolute sm:top-10 sm:left-10 sm:w-6/7 sm:h-6/7 w-[100px] h-100px bg-white rounded-3xl shadow-md"/>
//           </div>
//         )}
//         <div className="sm:flex sm:items-end mt-4 sm:ms-20">
//           <p className="flex flex-col lg:h-[60%] h-1/2">
//             <span className="sm:text-xl sm:text-left text-center text-lg font-medium text-[#232323] dark:text-white mb-2">
//               {title}
//             </span>
//             <span className="sm:text-md sm:text-left text-justify text-sm h-2/3 text-[#232323] dark:text-gray-50 overflow-hidden">
//               {content}
//             </span>
//           </p>
//           <button className="bg-[#232323] me-4 mt-4 w-full hover:bg-white text-white hover:text-[#232323] hover:border-gray-300 dark:border-gray-300 border rounded-xl dark:hover:bg-[#232323] dark:bg-white dark:hover:text-white dark:text-[#232323] lg:p-4 p-2 transition duration-300 font-medium">
//             Read more
//           </button>
//         </div>
//       </div>
//     </section>
//   );
// };