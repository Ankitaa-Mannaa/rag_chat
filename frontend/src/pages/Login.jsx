import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginThunk } from "../store/slices/authSlice";
import { Link, useLocation, useNavigate } from "react-router-dom";
import bgImage from "../assets/register bg.jpg"; 
export default function Login() {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((s) => s.auth);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [localError, setLocalError] = useState(""); 
  const loc = useLocation();
  const nav = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();
    const res = await dispatch(loginThunk({ username, password }));
    if (res.meta.requestStatus === "fulfilled") {
      const to = loc.state?.from?.pathname || "/dashboard";
      nav(to, { replace: true });
    } else {
      setLocalError(error || "Login failed");
    }
  };

  // ✅ Clear error after 3 seconds
  useEffect(() => {
    if (localError) {
      const timer = setTimeout(() => setLocalError(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [localError]);

  return (
    <div
      className="min-h-screen flex items-center justify-start bg-cover bg-center relative"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      {/* Dark overlay for readability */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Form Content */}
      <div className="relative z-10 w-full max-w-sm ml-48">
        {/* Glass Card */}
        <div className="backdrop-blur-xl bg-white/15 rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-all duration-300 relative">
          
          {/* Header */}
          <div className="text-center mb-6">
            <h1 className="text-4xl font-bold text-border-white bg-gradient-to-r from-purple-900 to-blue-900 bg-clip-text text-transparent mb-1">
              Welcome Back
            </h1>
            <p className="text-white text-sm">Log in to continue exploring your documents with AI</p>
          </div>

          {/* Form */}
          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-white pl-1">
                Username
              </label>
              <input
                className="w-full px-3 py-2 text-sm bg-white/70 border border-white/60 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 backdrop-blur-sm placeholder-gray-500"
                value={username}
                onChange={e => setUsername(e.target.value)}
                placeholder="Enter your username"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-white pl-1">
                Password
              </label>
              <input
                type="password"
                className="w-full px-3 py-2 text-sm bg-white/70 border border-white/60 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 backdrop-blur-sm placeholder-gray-500"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
              />
            </div>
            {localError && (
              <div className="p-3 bg-red-50/80 border border-red-200 rounded-lg backdrop-blur-sm">
                <p className="text-xs text-red-700">{localError}</p>
              </div>
            )}
            <button
              disabled={loading}
              className="w-full py-3 text-sm bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-bold rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 disabled:cursor-not-allowed"
            >
              {loading ? "Logging in..." : "Log In"}
            </button>
          </form>

          {/* Register link */}
          <div className="mt-5 text-center">
            <p className="text-lg text-white">
              Don't have account yet?{" "}
              <Link
                to="/register"
                className="text-purple-950 hover:text-purple-800 font-bold"
              >
                Register
              </Link>
            </p>
          </div>

          {/* Security notice */}
          <div className="mt-3 text-center">
            <p className="text-[10px] text-gray-300">
              Protected by enterprise-grade security
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
