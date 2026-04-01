import { useEffect, useState } from "react";
import { SquareArrowOutUpRight } from "lucide-react";

const HtmlCodeExecution = ({ code }: { code: string }) => {
  const [srcDoc, setSrcDoc] = useState("");

  useEffect(() => {
    const timeout = setInterval(() => {
      setSrcDoc(code);
    }, 300);
    return () => clearInterval(timeout);
  }, [code]);

  const openPreview = (code: string) => {
    const blob = new Blob([code], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    window.open(url, "_blank");
  };

  return (
    <>
      <div className="flex flex-col flex-1 min-h-0 border">
        <div className="flex items-center bg-gray-200 dark:bg-gray-800 px-3 py-1">
          <div className="flex space-x-2 mr-3">
            <span className="w-3 h-3 bg-red-500 rounded-full"></span>
            <span className="w-3 h-3 bg-yellow-400 rounded-full"></span>
            <span className="w-3 h-3 bg-green-500 rounded-full"></span>
          </div>

          <div className="flex-1 bg-white dark:bg-gray-700 rounded px-2 py-1 text-sm text-gray-800 dark:text-gray-100 truncate">
            http://localhost:9000
          </div>

          <button
            onClick={() => openPreview(code)}
            title="Open preview in new tab"
            className="ml-3 bg-transparent border  text-black px-3 py-1.5 rounded  cursor-pointer"
          >
            <SquareArrowOutUpRight  className="size-4" />
          </button>
        </div>

        <iframe
          srcDoc={srcDoc}
          frameBorder="0"
          sandbox="allow-scripts allow-same-origin"
          className="w-full flex-1 bg-white"
        ></iframe>
      </div>
    </>
  );
};

export default HtmlCodeExecution;
