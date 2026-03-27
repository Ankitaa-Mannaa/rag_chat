import { useDispatch, useSelector } from "react-redux";
import { setQuery, searchThunk } from "../store/slices/qaSlice";
import { useState } from "react";
import { SearchCheck, FileText, Zap } from "lucide-react";

export default function Search() {
  const dispatch = useDispatch();
  const { query, results, loading, error } = useSelector((s)=>s.qa);
  const [q, setQ] = useState(query);

  const run = () => dispatch(searchThunk(q));

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !loading) {
      run();
    }
  };

  return (
    <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-2xl shadow-xl border border-purple-100 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="bg-white/20 p-2 rounded-lg">
            <SearchCheck className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-xl font-bold text-white">Semantic Search</h2>
        </div>
      </div>

      {/* Search Input Section */}
      <div className="p-6">
        <div className="relative">
          <div className="flex gap-3">
            <div className="relative flex-1">
              <input 
                className="w-full pl-4 pr-4 py-3 border-2 border-purple-200 rounded-xl bg-white focus:border-purple-500 focus:ring-2 focus:ring-purple-200 focus:outline-none transition-all duration-200 text-gray-700 placeholder-gray-400 shadow-sm"
                placeholder="What is Django?" 
                value={q}
                onChange={(e)=>{ setQ(e.target.value); dispatch(setQuery(e.target.value)); }}
                onKeyDown={handleKeyPress}
              />
            </div>
            <button 
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-purple-700 hover:to-indigo-700 focus:ring-2 focus:ring-purple-300 focus:outline-none disabled:from-purple-300 disabled:to-indigo-300 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl flex items-center gap-2 min-w-[120px] justify-center" 
              onClick={run} 
              disabled={loading}
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Searching...
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4" />
                  Search
                </>
              )}
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl">
            <p className="text-sm text-red-700 font-medium">{error}</p>
          </div>
        )}

        {/* Results Section */}
        <div className="mt-6">
          {loading && (
            <div className="text-center py-8">
              <div className="inline-flex items-center gap-3 text-purple-600">
                <div className="w-6 h-6 border-2 border-purple-300 border-t-purple-600 rounded-full animate-spin"></div>
                <span className="text-sm font-medium">Searching for relevant content...</span>
              </div>
            </div>
          )}

          {!loading && results?.length === 0 && (
            <div className="text-center py-12">
              <div className="bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <SearchCheck className="w-8 h-8 text-purple-400" />
              </div>
              <p className="text-gray-500 font-medium">No results yet.</p>
              <p className="text-sm text-gray-400 mt-1">Try searching for something to see results here.</p>
            </div>
          )}

          {results?.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <FileText className="w-4 h-4 text-purple-600" />
                <span className="text-sm font-semibold text-gray-700">
                  Found {results.length} result{results.length !== 1 ? 's' : ''}
                </span>
              </div>
              
              {results.map((r, i)=>(
                <div key={i} className="group bg-white rounded-xl border border-purple-100 hover:border-purple-200 hover:shadow-lg transition-all duration-200 overflow-hidden">
                  <div className="p-5">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center gap-2">
                        <div className="bg-purple-100 text-purple-700 px-2 py-1 rounded-md text-xs font-medium">
                          Doc #{r.doc_id ?? r.document_id ?? "—"}
                        </div>
                      </div>
                      {typeof r.score !== "undefined" && (
                        <div className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white px-2 py-1 rounded-md text-xs font-medium">
                          {(r.score * 100).toFixed(1)}% match
                        </div>
                      )}
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4 border-l-4 border-purple-400">
                      <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">
                        {r.chunk || r.text || r.content}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}