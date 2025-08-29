import { useDispatch, useSelector } from "react-redux";
import { setQuery } from "../store/slices/qaSlice";
import { useEffect, useRef, useState } from "react";
import { MessageCircle, Sparkles, Brain, Send } from "lucide-react";

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

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !streaming && q.trim()) {
      startStream();
    }
  };

  useEffect(() => () => { if (esRef.current) esRef.current.close(); }, []);

  return (
    <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-2xl shadow-xl border border-purple-100 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="bg-white/20 p-2 rounded-lg">
            <Brain className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-xl font-bold text-white">Ask the AI (RAG)</h2>
          <div className="ml-auto">
            <div className="flex items-center gap-1 text-white/80 text-xs">
              <Sparkles className="w-3 h-3" />
              <span>Powered by RAG</span>
            </div>
          </div>
        </div>
      </div>

      {/* Input Section */}
      <div className="p-6">
        <div className="relative">
          <div className="flex gap-3">
            <div className="relative flex-1">
              <input
                className="w-full pl-4 pr-12 py-3 border-2 border-purple-200 rounded-xl bg-white focus:border-purple-500 focus:ring-2 focus:ring-purple-200 focus:outline-none transition-all duration-200 text-gray-700 placeholder-gray-400 shadow-sm"
                placeholder="Explain Django REST Framework"
                value={q}
                onChange={(e) => {
                  setQ(e.target.value);
                  dispatch(setQuery(e.target.value));
                }}
                onKeyPress={handleKeyPress}
              />
              <MessageCircle className="absolute right-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            </div>
            <button 
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-purple-700 hover:to-indigo-700 focus:ring-2 focus:ring-purple-300 focus:outline-none disabled:from-purple-300 disabled:to-indigo-300 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl flex items-center gap-2 min-w-[100px] justify-center"
              onClick={startStream}
              disabled={streaming || !q.trim()}
            >
              {streaming ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Thinking...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  Ask
                </>
              )}
            </button>
          </div>
        </div>

        {/* Answer Section */}
        {(streaming || streamText) && (
          <div className="mt-6">
            <div className="bg-white rounded-xl border border-purple-100 shadow-sm overflow-hidden">
              {/* Answer Header */}
              <div className="bg-gradient-to-r from-purple-50 to-indigo-50 px-4 py-3 border-b border-purple-100">
                <div className="flex items-center gap-2">
                  {streaming ? (
                    <>
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-purple-500 rounded-full animate-pulse"></div>
                        <span className="text-sm font-semibold text-purple-700">AI is thinking...</span>
                      </div>
                      <div className="ml-auto flex gap-1">
                        <div className="w-1 h-4 bg-purple-400 rounded-full animate-bounce"></div>
                        <div className="w-1 h-4 bg-purple-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                        <div className="w-1 h-4 bg-purple-600 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                      <span className="text-sm font-semibold text-gray-700">Answer Complete</span>
                    </>
                  )}
                </div>
              </div>

              {/* Answer Content */}
              <div className="p-5">
                <div className="prose prose-sm max-w-none">
                  <div className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                    {streamText || (
                      <div className="text-gray-400 italic">
                        Waiting for AI response...
                      </div>
                    )}
                    {streaming && (
                      <span className="inline-block w-2 h-5 bg-purple-500 animate-pulse ml-1"></span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Streaming Stats */}
            {streaming && (
              <div className="mt-3 text-center">
                <div className="inline-flex items-center gap-2 text-xs text-purple-600 bg-purple-50 px-3 py-1 rounded-full">
                  <Sparkles className="w-3 h-3 animate-spin" />
                  <span>Processing your question with RAG technology</span>
                </div>
              </div>
            )}

            {/* Word Count */}
            {streamText && !streaming && (
              <div className="mt-3 text-center">
                <div className="inline-flex items-center gap-2 text-xs text-gray-500 bg-gray-50 px-3 py-1 rounded-full">
                  <span>{streamText.split(' ').filter(word => word.trim()).length} words generated</span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Empty State */}
        {!streaming && !streamText && (
          <div className="mt-8 text-center py-8">
            <div className="bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <Brain className="w-8 h-8 text-purple-400" />
            </div>
            <p className="text-gray-500 font-medium">Ready to answer your questions</p>
            <p className="text-sm text-gray-400 mt-1">Ask anything about your documents using RAG-powered AI</p>
          </div>
        )}
      </div>
    </div>
  );
}