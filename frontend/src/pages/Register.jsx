import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { registerThunk } from "../store/slices/authSlice";
import { Link, useNavigate } from "react-router-dom";

export default function Register() {
  const dispatch = useDispatch();
  const nav = useNavigate();
  const { loading, error } = useSelector((s) => s.auth);

  const [form, setForm] = useState({ name: "", email: "", password: "" });

  const submit = async (e) => {
    e.preventDefault();
    const res = await dispatch(registerThunk(form));
    if (res.meta.requestStatus === "fulfilled") nav("/login");
  };

  return (
    <div className="max-w-md mx-auto">
      <div className="card">
        <h1 className="text-lg font-semibold mb-4">Create account</h1>
        <form onSubmit={submit} className="space-y-4">
          <div><label className="label">Name</label>
            <input className="input" value={form.name} onChange={e=>setForm({...form, name:e.target.value})} />
          </div>
          <div><label className="label">Email</label>
            <input className="input" value={form.email} onChange={e=>setForm({...form, email:e.target.value})} />
          </div>
          <div><label className="label">Password</label>
            <input type="password" className="input" value={form.password} onChange={e=>setForm({...form, password:e.target.value})} />
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button disabled={loading} className="btn btn-primary w-full">{loading ? "Creating..." : "Register"}</button>
        </form>
        <p className="mt-3 text-sm">Already have an account? <Link className="text-blue-600" to="/login">Login</Link></p>
      </div>
    </div>
  );
}
