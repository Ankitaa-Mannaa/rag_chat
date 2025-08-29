import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { usageThunk } from "../store/slices/usageSlice";
import { BarChart3, TrendingUp, Activity, Calendar, Clock, Target } from "lucide-react";

export default function Usage() {
  const dispatch = useDispatch();
  const { summary, loading, error } = useSelector((s) => s.usage);

  useEffect(()=>{ dispatch(usageThunk()); }, [dispatch]);

  return (
    <div className="max-w-full">
      <div className="space-y-6">
        {/* Header Card */}
        
          <div className=" px-6 py-4">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-2 rounded-2xl">
                <BarChart3 className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-purple-900">Usage Analytics</h2>
            </div>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="p-6 text-center py-8">
              <div className="inline-flex items-center gap-3 text-purple-600">
                <div className="w-6 h-6 border-2 border-purple-300 border-t-purple-600 rounded-full animate-spin"></div>
                <span className="text-sm font-medium">Loading usage data...</span>
              </div>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="p-6">
              <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
                <p className="text-sm text-red-700 font-medium">Error loading usage data</p>
                <p className="text-sm text-red-600 mt-2">
                  {typeof error === "string" ? error : JSON.stringify(error)}
                </p>
              </div>
            </div>
          )}

          {/* Empty State */}
          {!loading && !summary && !error && (
            <div className="p-6 text-center py-8">
              <div className="bg-purple-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                <BarChart3 className="w-6 h-6 text-purple-400" />
              </div>
              <p className="text-sm text-gray-500 font-medium">No usage data yet</p>
              <p className="text-xs text-gray-400 mt-1">Start using the AI to see your usage stats</p>
            </div>
          )}
        

        {/* Stats Cards Grid */}
        {summary && !loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 px-6">
            {/* Today's Usage Card */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl shadow-lg border border-blue-100 overflow-hidden">
              <div className="bg-gradient-to-r from-blue-500 to-indigo-500 px-4 py-3">
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-white" />
                  <span className="text-sm font-semibold text-white">Today</span>
                </div>
              </div>
              <div className="p-6 text-center">
                <div className="text-3xl font-bold text-gray-800 mb-2">{summary.today}</div>
                <div className="flex items-center justify-center gap-2 text-xs text-gray-600">
                  <TrendingUp className="w-3 h-3 text-green-500" />
                  <span>Questions asked</span>
                </div>
              </div>
            </div>

            {/* Remaining Today Card */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl shadow-lg border border-green-100 overflow-hidden">
              <div className="bg-gradient-to-r from-green-500 to-emerald-500 px-4 py-3">
                <div className="flex items-center gap-2">
                  <Target className="w-4 h-4 text-white" />
                  <span className="text-sm font-semibold text-white">Remaining</span>
                </div>
              </div>
              <div className="p-6 text-center">
                <div className="text-3xl font-bold text-gray-800 mb-2">{summary.remaining_today}</div>
                <div className="flex items-center justify-center gap-2 text-xs text-gray-600">
                  <Target className="w-3 h-3 text-green-500" />
                  <span>Left for today</span>
                </div>
              </div>
            </div>

            {/* Month-to-Date Card */}
            <div className="bg-gradient-to-br from-purple-50 to-violet-50 rounded-xl shadow-lg border border-purple-100 overflow-hidden">
              <div className="bg-gradient-to-r from-purple-500 to-violet-500 px-4 py-3">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-white" />
                  <span className="text-sm font-semibold text-white">This Month</span>
                </div>
              </div>
              <div className="p-6 text-center">
                <div className="text-3xl font-bold text-gray-800 mb-2">{summary.month_to_date}</div>
                <div className="flex items-center justify-center gap-2 text-xs text-gray-600">
                  <Calendar className="w-3 h-3 text-purple-500" />
                  <span>Month-to-date</span>
                </div>
              </div>
            </div>

            {/* Last 24 Hours Card */}
            <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl shadow-lg border border-orange-100 overflow-hidden">
              <div className="bg-gradient-to-r from-orange-500 to-amber-500 px-4 py-3">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-white" />
                  <span className="text-sm font-semibold text-white">24 Hours</span>
                </div>
              </div>
              <div className="p-6 text-center">
                <div className="text-3xl font-bold text-gray-800 mb-2">{summary.last_24h}</div>
                <div className="flex items-center justify-center gap-2 text-xs text-gray-600">
                  <Clock className="w-3 h-3 text-orange-500" />
                  <span>Last 24 hours</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}