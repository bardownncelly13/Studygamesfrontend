import { useState , useEffect, useRef } from "react";
import * as pdfjsLib from "pdfjs-dist";
import pdfjsWorker from "pdfjs-dist/build/pdf.worker?url";
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;

export default function PdfReader({ onExtract, Remove}) {
  const [fileName, setFileName] = useState("");
  const inputRef = useRef(null);

  useEffect(() => {
    if (Remove) {
      handleRemoveFile();
    }
  }, [Remove]);
  
  const handleFileUpload = async (e) => {
    if(Remove){
      handleRemoveFile();
    }
    const file = e.target.files[0];
    if (!file) return;

    setFileName(file.name);
    const ext = file.name.split(".").pop().toLowerCase();

    if (ext === "pdf") {
      const fileReader = new FileReader();
      fileReader.onload = async () => {
        const typedarray = new Uint8Array(fileReader.result);
        const pdf = await pdfjsLib.getDocument({
          data: typedarray,
          disableAutoFetch: true,
          disableStream: true,
        }).promise;

        let pdfText = "";
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const content = await page.getTextContent();
          const strings = content.items.map((item) => item.str);
          pdfText += strings.join(" ") + "\n";
        }

        onExtract?.(pdfText);
      };
      fileReader.readAsArrayBuffer(file);
    }

    if (ext === "txt") {
      const text = await file.text();
      onExtract?.(text);
    }
  };

  const handleRemoveFile = () => {
    setFileName("");
    onExtract?.(""); 
    if (inputRef.current) {
      inputRef.current.value = null; // <-- reset input value
    }
  };

  return (
    <div className="flex-1 bg-gradient-to-br from-dark-100 to-dark-200 rounded-2xl p-6 shadow-lg border border-white/10">
      <h2 className="text-2xl font-bold text-white mb-4 tracking-wide">
        📂 Upload File
      </h2>
      <p className="pb-2 text-white"> Uploading a file will create a deck to learn about the file</p>
      <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-white/20 rounded-lg cursor-pointer bg-dark-300 hover:border-white/40 hover:bg-dark-200 transition-all duration-300">
        <span className="text-white/80 font-medium mb-1">
          Click or drag to upload
        </span>
        <span className="text-xs text-white/50">(.pdf, .txt)</span>
        <input
          ref={inputRef} 
          type="file"
          accept=".pdf,.txt"
          onChange={handleFileUpload}
          className="hidden"
        />
      </label>

      {fileName && (
        <div className="mt-3 flex items-center justify-between bg-dark-300 rounded-md p-2 text-sm">
          <p className="text-emerald-400 font-medium truncate">
            ✅ Uploaded: <span className="text-white/80">{fileName}</span>
          </p>
          <button
            onClick={handleRemoveFile}
            className="ml-3 text-red-400 hover:text-red-600 transition text-xs font-semibold"
          >
            ✖ Remove
          </button>
        </div>
      )}
    </div>
  );
}
