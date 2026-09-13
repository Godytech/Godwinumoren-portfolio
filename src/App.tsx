import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Portfolio from "./pages/Portfolio";
import Login from "./pages/admin/Login";
import Dashboard from "./pages/admin/Dashboard";
import { ProtectedRoute } from "./routes/ProtectedRoute";

export default function App() {
  const basename = import.meta.env.BASE_URL.replace(/\/$/, "") || undefined;

  return (
    <AuthProvider>
      <Router basename={basename}>
        <Routes>
          {/* Public Portfolio */}
          <Route path="/" element={<Portfolio />} />

          {/* Admin CMS Authentication */}
          <Route path="/admin/login" element={<Login />} />

          {/* Admin CMS Protected Dashboard */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}
