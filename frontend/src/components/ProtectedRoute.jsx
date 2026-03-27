import { Navigate, Outlet, useLocation } from "react-router-dom";

export default function ProtectedRoute() {
  const token = localStorage.getItem("rag_token");
  const loc = useLocation();
  return token ? <Outlet /> : <Navigate to="/login" state={{ from: loc }} replace />;
}
