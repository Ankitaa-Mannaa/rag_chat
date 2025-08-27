import { useDispatch, useSelector } from "react-redux";
import { setQuery } from "../store/slices/qaSlice";
import { useEffect, useRef, useState } from "react";

export default function Ask() {
  const dispatch = useDispatch();
  const { query } = useSelector((s) => s.qa);
  const [q, setQ] = useState(query);
  const [streaming, setStreaming] = useState(false);
  const [streamText, setStreamText] = useState("");
  const esRef = useRef(null);

  const startStream = () => {
    if (esRef.current) esRef.current.close();
    setStreaming(true);
    setStreamText("");

    const token = localStorage.getItem("rag_token"); 
    const url = `${import.meta.env.VITE_API_BASE_URL}/api/answer/?query=${encodeURIComponent(
      q
    )}&token=${token}`;

    const es = new EventSource(url);
    es.onmessage = (e) => {
      if (e.data === "[END]") {
        es.close();
        setStreaming(false);
      } else {
        setStreamText((t) => t + e.data);
      }
    };
    es.onerror = () => {
      es.close();
      setStreaming(false);
    };
    esRef.current = es;
  };

  useEffect(() => () => { if (esRef.current) esRef.current.close(); }, []);

  return (
    <div className="card">
      <h2 className="text-base font-semibold mb-4">Ask the AI (RAG)</h2>
      <div className="flex gap-2">
        <input
          className="input"
          placeholder="Explain Django REST Framework"
          value={q}
          onChange={(e) => {
            setQ(e.target.value);
            dispatch(setQuery(e.target.value));
          }}
        />
        <button className="btn btn-outline" onClick={startStream}>Ask</button>
      </div>

      {(streaming || streamText) && (
      <div className="mt-4">
        <p className="text-xs text-gray-500 mb-1">
          {streaming ? "Streaming" : "Answer"}
        </p>
        <div className="p-3 rounded-lg border bg-white whitespace-pre-wrap">
          {streamText}
        </div>
      </div>
    )}
    </div>
  );
}
