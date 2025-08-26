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
    <header className="border-b bg-white">
      <div className="container flex items-center justify-between py-3">
        <Link to="/" className="font-semibold">RAG Console</Link>
        <nav className="flex items-center gap-4">
          {authed && (
            <>
              <Link className={`text-sm ${pathname==="/dashboard"?"font-semibold":""}`} to="/dashboard">Documents</Link>
              <Link className={`text-sm ${pathname==="/search"?"font-semibold":""}`} to="/search">Search</Link>
              <Link className={`text-sm ${pathname==="/ask"?"font-semibold":""}`} to="/ask">Ask</Link>
              <Link className={`text-sm ${pathname==="/usage"?"font-semibold":""}`} to="/usage">Usage</Link>
            </>
          )}
          {!authed ? (
            <>
              <Link className="text-sm" to="/login">Login</Link>
              <Link className="text-sm" to="/register">Register</Link>
            </>
          ) : (
            <button
              className="btn btn-outline text-sm"
              onClick={() => { dispatch(logout()); nav("/login"); }}
            >Logout</button>
          )}
        </nav>
      </div>
    </header>
  );
}
