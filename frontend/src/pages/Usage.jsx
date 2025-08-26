import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { usageThunk } from "../store/slices/usageSlice";

export default function Usage() {
  const dispatch = useDispatch();
  const { count, loading, error } = useSelector((s)=>s.usage);

  useEffect(()=>{ dispatch(usageThunk()); }, [dispatch]);

  return (
    <div className="max-w-md">
      <div className="card">
        <h2 className="text-base font-semibold mb-2">Usage</h2>
        {loading ? <p className="text-sm text-gray-500">Loading…</p> :
          <p className="text-sm">Questions asked: <span className="font-semibold">{count}</span></p>
        }
        {error && <p className="text-sm text-red-600 mt-1">{error}</p>}
      </div>
    </div>
  );
}
