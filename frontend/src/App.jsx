// App.jsx
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Documents from "./pages/Documents";
import Dashboard from "./pages/Dashboard"
import Search from "./pages/Search";
import Ask from "./pages/Ask";
import Usage from "./pages/Usage";
import LandingPage from "./pages/LandingPage";
import ProtectedRoute from "./components/ProtectedRoute";

function Layout({ children }) {
  const { pathname } = useLocation();
  const hideNavbar = ["/", "/login", "/register"].includes(pathname);
  return (
    <div className="min-h-screen bg-purple-500/20 text-gray-900">
      {!hideNavbar && <Navbar />}
      <main className={hideNavbar ? "" : "container py-6"}>{children}</main>
    </div>
  );
}

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard/>} />
          <Route path="/documents" element={<Documents />} />
          <Route path="/search" element={<Search />} />
          <Route path="/ask" element={<Ask />} />
          <Route path="/usage" element={<Usage />} />
        </Route>

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Layout>
  );
}
