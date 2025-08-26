import { useDispatch, useSelector } from "react-redux";
import { answerThunk, setQuery } from "../store/slices/qaSlice";
import { useEffect, useRef, useState } from "react";

export default function Ask() {
  const dispatch = useDispatch();
  const { query, answer, sources, loading, error } = useSelector((s)=>s.qa);
  const [q, setQ] = useState(query);
  const [streaming, setStreaming] = useState(false);
  const [streamText, setStreamText] = useState("");
  const esRef = useRef(null);

  const ask = () => dispatch(answerThunk(q));

  // Optional: try SSE if your backend exposes /api/answer/stream?query=...
  const startStream = () => {
    if (esRef.current) esRef.current.close();
    setStreaming(true);
    setStreamText("");
    const url = `${import.meta.env.VITE_API_BASE_URL}/api/answer/stream?query=${encodeURIComponent(q)}`;
    const es = new EventSource(url, { withCredentials: true });
    es.onmessage = (e) => setStreamText((t) => t + e.data);
    es.onerror = () => { es.close(); setStreaming(false); };
    esRef.current = es;
  };
  useEffect(()=>()=>{ if (esRef.current) esRef.current.close(); }, []);

  return (
    <div className="card">
      <h2 className="text-base font-semibold mb-4">Ask the AI (RAG)</h2>
      <div className="flex gap-2">
        <input className="input" placeholder="Explain Django REST Framework"
               value={q} onChange={(e)=>{ setQ(e.target.value); dispatch(setQuery(e.target.value)); }} />
        <button className="btn btn-primary" onClick={ask} disabled={loading}>Ask</button>
        <button className="btn btn-outline" onClick={startStream}>Stream (SSE)</button>
      </div>
      {error && <p className="text-sm text-red-600 mt-2">{error}</p>}

      {(loading || answer) && (
        <div className="mt-4">
          <p className="text-xs text-gray-500 mb-1">Final answer</p>
          <div className="p-3 rounded-lg border bg-white whitespace-pre-wrap">{loading ? "Thinking..." : (answer || "—")}</div>
        </div>
      )}

      {streaming && (
        <div className="mt-4">
          <p className="text-xs text-gray-500 mb-1">Streaming</p>
          <div className="p-3 rounded-lg border bg-white whitespace-pre-wrap">{streamText}</div>
        </div>
      )}

      {!!sources?.length && (
        <div className="mt-4">
          <p className="text-xs text-gray-500 mb-1">Sources</p>
          <ul className="list-disc ml-5 text-sm">
            {sources.map((s,i)=>(<li key={i}>doc #{s}</li>))}
          </ul>
        </div>
      )}
    </div>
  );
}
