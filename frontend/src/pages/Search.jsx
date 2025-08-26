import { useDispatch, useSelector } from "react-redux";
import { setQuery, searchThunk } from "../store/slices/qaSlice";
import { useState } from "react";

export default function Search() {
  const dispatch = useDispatch();
  const { query, results, loading, error } = useSelector((s)=>s.qa);
  const [q, setQ] = useState(query);

  const run = () => dispatch(searchThunk(q));

  return (
    <div className="card">
      <h2 className="text-base font-semibold mb-4">Semantic Search</h2>
      <div className="flex gap-2">
        <input className="input" placeholder="What is Django?" value={q}
               onChange={(e)=>{ setQ(e.target.value); dispatch(setQuery(e.target.value)); }} />
        <button className="btn btn-primary" onClick={run} disabled={loading}>{loading ? "Searching..." : "Search"}</button>
      </div>
      {error && <p className="text-sm text-red-600 mt-2">{error}</p>}

      <div className="mt-4 space-y-3">
        {results?.map((r, i)=>(
          <div key={i} className="p-3 rounded-lg border bg-white">
            <div className="flex justify-between">
              <p className="text-xs text-gray-500">doc #{r.doc_id ?? r.document_id ?? "—"}</p>
              {typeof r.score !== "undefined" && <p className="text-xs text-gray-500">score: {Number(r.score).toFixed(3)}</p>}
            </div>
            <p className="mt-1 text-sm whitespace-pre-wrap">{r.chunk || r.text || r.content}</p>
          </div>
        ))}
        {!loading && results?.length===0 && <p className="text-sm text-gray-500">No results yet.</p>}
      </div>
    </div>
  );
}
