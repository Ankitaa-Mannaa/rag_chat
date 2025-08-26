import { useState } from "react";

export default function FileDropZone({ onFile }) {
  const [drag, setDrag] = useState(false);

  return (
    <div
      className={`card border-dashed ${drag ? "border-blue-500" : "border-gray-300"} cursor-pointer`}
      onDragOver={(e)=>{ e.preventDefault(); setDrag(true); }}
      onDragLeave={()=>setDrag(false)}
      onDrop={(e)=>{
        e.preventDefault(); setDrag(false);
        const f = e.dataTransfer.files?.[0];
        if (f) onFile(f);
      }}
      onClick={()=>document.getElementById("file-input").click()}
    >
      <input id="file-input" type="file" className="hidden" accept=".pdf,.txt,.docx"
             onChange={(e)=>{ const f=e.target.files?.[0]; if (f) onFile(f); }} />
      <div className="text-center py-10">
        <p className="text-sm text-gray-600">Drag & drop PDF/TXT/DOCX here, or click to browse.</p>
      </div>
    </div>
  );
}
