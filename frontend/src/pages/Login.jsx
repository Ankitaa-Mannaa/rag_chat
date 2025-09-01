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
  const [showPassword, setShowPassword] = useState(false);  
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

  useEffect(() => {
    if (localError) {
      const timer = setTimeout(() => setLocalError(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [localError]);

  return (
    <div
      className="min-h-screen flex items-center justify-center sm:justify-start bg-cover bg-center relative"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Form Content */}
      <div className="relative z-10 w-full max-w-sm px-4 sm:px-0 sm:ml-48">
        {/* Glass Card */}
        <div className="backdrop-blur-xl bg-white/15 rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-all duration-300 relative">
          
          {/* Header */}
          <div className="text-center mb-6">
            <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-purple-900 to-blue-900 bg-clip-text text-transparent mb-1">
              Welcome Back
            </h1>
            <p className="text-white text-sm">
              Log in to continue exploring your documents with AI
            </p>
          </div>

          {/* Form */}
          <form onSubmit={onSubmit} className="space-y-4">
            {/* Username */}
            <div>
              <label className="block text-xs font-semibold text-white pl-1">
                Username
              </label>
              <input
                className="w-full px-3 py-2 text-sm bg-white/70 border border-white/60 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 placeholder-gray-500"
                value={username}
                onChange={e => setUsername(e.target.value)}
                placeholder="Enter your username"
                required
              />
            </div>

            {/* Password with toggle */}
            <div>
              <label className="block text-xs font-semibold text-white pl-1">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}  
                  className="w-full px-3 py-2 pr-10 text-sm bg-white/70 border border-white/60 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 placeholder-gray-500"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                />
                {/* Toggle button */}
                <button
                  type="button"
                  className="absolute inset-y-0 right-2 flex items-center text-gray-600 hover:text-purple-600"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    // Eye-slash icon
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-5.523 0-10-4.477-10-10 0-1.042.159-2.046.45-3a1 1 0 011.902.582A8.003 8.003 0 0012 17a7.963 7.963 0 004.95-1.725 1 1 0 011.45 1.45 9.985 9.985 0 01-4.525 2.1zM15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  ) : (
                    // Eye icon
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Error */}
            {localError && (
              <div className="p-3 bg-red-50/80 border border-red-200 rounded-lg">
                {typeof localError === "object" ? (
                  <ul className="text-xs text-red-700 space-y-1">
                    {Object.entries(localError).map(([field, msgs], idx) =>
                      Array.isArray(msgs) ? (
                        msgs.map((m, i) => (
                          <li key={field + i}>
                            {field}: {m}
                          </li>
                        ))
                      ) : (
                        <li key={idx}>{msgs}</li>
                      )
                    )}
                  </ul>
                ) : (
                  <p className="text-xs text-red-700">{localError}</p>
                )}
              </div>
            )}

            {/* Submit */}
            <button
              disabled={loading}
              className="w-full py-3 text-sm bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-bold rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 disabled:cursor-not-allowed"
            >
              {loading ? "Logging in..." : "Log In"}
            </button>
          </form>

          {/* Register link */}
          <div className="mt-5 text-center">
            <p className="text-sm sm:text-base text-white">
              Don&apos;t have an account yet?{" "}
              <Link
                to="/register"
                className="text-purple-900 hover:text-purple-100 font-bold"
              >
                Register
              </Link>
            </p>
          </div>

          {/* Security notice */}
          <div className="mt-3 text-center">
            <p className="text-[10px] text-gray-400">
              Protected by enterprise-grade security
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
