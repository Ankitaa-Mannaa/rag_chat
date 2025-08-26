import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginThunk } from "../store/slices/authSlice";
import { Link, useLocation, useNavigate } from "react-router-dom";

export default function Login() {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((s) => s.auth);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const loc = useLocation();
  const nav = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();
    const res = await dispatch(loginThunk({ username, password }));
    if (res.meta.requestStatus === "fulfilled") {
      const to = loc.state?.from?.pathname || "/dashboard";
      nav(to, { replace: true });
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <div className="card">
        <h1 className="text-lg font-semibold mb-4">Login</h1>
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="label">Username</label>
            <input
              className="input"
              value={username}
              onChange={e => setUsername(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="label">Password</label>
            <input
              type="password"
              className="input"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button disabled={loading} className="btn btn-primary w-full">
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>
        <p className="mt-3 text-sm">
          No account? <Link to="/register" className="text-blue-600">Register</Link>
        </p>
      </div>
    </div>
  );
}
