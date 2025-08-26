import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import FileDropZone from "../components/FileDropZone";
import { listDocsThunk, uploadDocThunk } from "../store/slices/docSlice";

export default function Dashboard() {
  const dispatch = useDispatch();
  const { items, loading, error, uploaded } = useSelector((s) => s.documents);
  const [sel, setSel] = useState(null);

  useEffect(()=>{ dispatch(listDocsThunk()); }, [dispatch, uploaded]);

  const onFile = (file) => { setSel(file); };
  const onUpload = () => { if (sel) dispatch(uploadDocThunk(sel)); };

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <div className="card">
        <h2 className="text-base font-semibold mb-3">Upload document</h2>
        <FileDropZone onFile={onFile} />
        {sel && (
          <div className="flex items-center justify-between mt-3">
            <p className="text-sm text-gray-700 truncate">Selected: <span className="font-medium">{sel.name}</span></p>
            <button className="btn btn-primary" onClick={onUpload} disabled={loading}>
              {loading ? "Uploading..." : "Upload"}
            </button>
          </div>
        )}
        {error && <p className="text-sm text-red-600 mt-2">{error}</p>}
        {uploaded && <p className="text-sm text-green-700 mt-2">Uploaded ✓</p>}
      </div>

      <div className="card">
        <h2 className="text-base font-semibold mb-3">Your documents</h2>
        {loading && items.length===0 && <p className="text-sm text-gray-500">Loading…</p>}
        <ul className="divide-y">
          {items?.map((d)=>(
            <li key={d.id} className="py-2 flex items-center justify-between">
              <div className="min-w-0">
                <p className="truncate text-sm font-medium">{d.name || `Document #${d.id}`}</p>
                <p className="text-xs text-gray-500">id: {d.id}</p>
              </div>
              <span className="text-xs text-gray-500">{d.size_readable || d.size || ""}</span>
            </li>
          ))}
          {items?.length === 0 && <li className="py-2 text-sm text-gray-500">No documents yet.</li>}
        </ul>
      </div>
    </div>
  );
}
