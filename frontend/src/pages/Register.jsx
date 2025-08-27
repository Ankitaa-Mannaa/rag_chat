import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { registerThunk } from "../store/slices/authSlice";
import { Link, useNavigate } from "react-router-dom";
import bgImage from "../assets/register bg.jpg"; // ✅ put your image inside /src/assets

export default function Register() {
  const dispatch = useDispatch();
  const nav = useNavigate();
  const { loading, error } = useSelector((s) => s.auth);

  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [localError, setLocalError] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    const res = await dispatch(registerThunk(form));
    if (res.meta.requestStatus === "fulfilled") {
      nav("/login"); // ✅ redirect on success
    } else {
      setLocalError(error || "Registration failed");
    }
  };

  // ✅ Clear error after 4 seconds
  useEffect(() => {
    if (localError) {
      const timer = setTimeout(() => setLocalError(""), 4000);
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
        {/* Glass Card Effect (unchanged design) */}
        <div className="backdrop-blur-xl bg-white/15 rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-all duration-300 relative">

          {/* Header Section */}
          <div className="text-center mb-6">
            <h1 className="text-4xl font-bold text-border-white bg-gradient-to-r from-purple-900 to-blue-900 bg-clip-text text-transparent mb-1">
              Join ReasonBot
            </h1>
            <p className="text-white text-sm">
              Create your free account and start exploring your documents with AI
            </p>
          </div>

          {/* Trust indicators */}
          <div className="flex justify-center space-x-4 mb-5">
            <div className="flex items-center space-x-1 text-xs text-white">
              <svg className="w-3.5 h-3.5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
              </svg>
              <span>Free forever</span>
            </div>
            <div className="flex items-center space-x-1 text-xs text-white">
              <svg className="w-3.5 h-3.5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd"/>
              </svg>
              <span>Secure & private</span>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={submit} className="space-y-4">
            <div className="space-y-1">
              <label className="block text-xs font-semibold text-white pl-1">
                Full Name
              </label>
              <input
                className="w-full px-3 py-2 text-sm bg-white/70 border border-white/60 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 backdrop-blur-sm placeholder-gray-500"
                placeholder="Enter your full name"
                value={form.name}
                onChange={e=>setForm({...form, name:e.target.value})}
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-semibold text-white pl-1">
                Email Address
              </label>
              <input
                type="email"
                className="w-full px-3 py-2 text-sm bg-white/70 border border-white/60 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 backdrop-blur-sm placeholder-gray-500"
                placeholder="Enter your email address"
                value={form.email}
                onChange={e=>setForm({...form, email:e.target.value})}
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-semibold text-white pl-1">
                Password
              </label>
              <input
                type="password"
                className="w-full px-3 py-2 text-sm bg-white/70 border border-white/60 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 backdrop-blur-sm placeholder-gray-500"
                placeholder="Create a secure password"
                value={form.password}
                onChange={e=>setForm({...form, password:e.target.value})}
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
              {loading ? "Creating Account..." : "Create Free Account"}
            </button>
          </form>

          {/* Login Link */}
          <div className="mt-5 text-center">
            <p className="text-lg text-white">
              Already have an account?{" "}
              <Link
                className="text-purple-950 hover:text-purple-800 font-bold"
                to="/login"
              >
                Log In
              </Link>
            </p>
          </div>

          {/* Security notice */}
          <div className="mt-3 text-center">
            <p className="text-[10px] text-gray-500">
              Protected by enterprise-grade security
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
