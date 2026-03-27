import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../store/slices/authSlice";

export default function Navbar() {
  const { user } = useSelector((s) => s.auth);
  const dispatch = useDispatch();
  const nav = useNavigate();
  const { pathname } = useLocation();

  const authed = !!(user?.token || localStorage.getItem("rag_token"));

  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/80 border-b border-white/60 shadow-lg">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transform group-hover:scale-105 transition-all duration-200">
              <span className="text-white font-bold text-lg">R</span>
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-900 to-blue-700">
                ReasonBot
              </span>
              <span className="text-xs text-gray-500 font-medium -mt-1">AI Document Analysis</span>
            </div>
          </Link>

          {/* Navigation */}
          <nav className="flex items-center space-x-1">
            {authed ? (
              <>
                {/* Navigation Links */}
                <div className="hidden md:flex items-center space-x-1 mr-4">
                  {[
                    { path: "/dashboard", label: "Home", icon: "🏠" },
                    { path: "/documents", label: "Documents", icon: "📄" },
                    { path: "/search", label: "Search", icon: "🔍" },
                    { path: "/ask", label: "Ask", icon: "🤖" },
                    { path: "/usage", label: "Usage", icon: "📊" }
                  ].map((item) => (
                    <Link
                      key={item.path}
                      className={`relative px-4 py-2 rounded-xl font-medium text-sm transition-all duration-200 group ${
                        pathname === item.path 
                          ? "text-purple-700 bg-purple-100/80 shadow-sm" 
                          : "text-gray-600 hover:text-purple-700 hover:bg-purple-50/60"
                      }`}
                      to={item.path}
                    >
                      <div className="flex items-center space-x-2">
                        <span className="text-base">{item.icon}</span>
                        <span>{item.label}</span>
                      </div>
                      
                      {/* Active indicator */}
                      {pathname === item.path && (
                        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-6 h-0.5 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full"></div>
                      )}
                    </Link>
                  ))}
                </div>

                {/* User Profile & Logout */}
                <div className="flex items-center space-x-3">
                  {/* User Avatar */}
                  <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-blue-500 rounded-lg flex items-center justify-center shadow-md">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>

                  {/* Logout Button */}
                  <button
                    className="px-4 py-2 bg-white/60 hover:bg-red-50 border border-gray-200 hover:border-red-200 text-gray-600 hover:text-red-600 rounded-xl font-medium text-sm transition-all duration-200 backdrop-blur-sm shadow-sm hover:shadow-md group"
                    onClick={() => {
                      dispatch(logout());
                      nav("/login");
                    }}
                  >
                    <div className="flex items-center space-x-2">
                      <svg className="w-4 h-4 group-hover:rotate-12 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      <span>Logout</span>
                    </div>
                  </button>
                </div>

                {/* Mobile Menu Button */}
                <button className="md:hidden p-2 text-gray-600 hover:text-purple-700 hover:bg-purple-50 rounded-lg transition-colors">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
              </>
            ) : (
              // Guest Navigation
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className="px-4 py-2 text-purple-600 hover:text-purple-800 font-semibold text-sm transition-colors duration-200 relative group"
                >
                  <span className="relative z-10">Login</span>
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-purple-600 group-hover:w-full transition-all duration-300"></span>
                </Link>
                
                <Link to="/register">
                  <button className="px-6 py-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-xl font-semibold text-sm shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200">
                    Get Started Free
                  </button>
                </Link>
              </div>
            )}
          </nav>
        </div>
      </div>

      {/* Mobile Menu Overlay (hidden by default - you can implement toggle logic) */}
      <div className="hidden md:hidden absolute top-full left-0 right-0 bg-white/95 backdrop-blur-xl border-b border-gray-200 shadow-lg">
        <div className="container mx-auto px-6 py-4 space-y-2">
          {authed && [
            { path: "/dashboard", label: "Home", icon: "🏠" },
            { path: "/documents", label: "Documents", icon: "📄" },
            { path: "/search", label: "Search", icon: "🔍" },
            { path: "/ask", label: "Ask", icon: "🤖" },
            { path: "/usage", label: "Usage", icon: "📊" }
          ].map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-colors ${
                pathname === item.path 
                  ? "text-purple-700 bg-purple-100" 
                  : "text-gray-600 hover:text-purple-700 hover:bg-purple-50"
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              <span className="font-medium">{item.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </header>
  );
}