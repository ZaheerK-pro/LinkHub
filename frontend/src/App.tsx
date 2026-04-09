import { Navigate, Route, Routes } from "react-router-dom";
import { useAuth } from "./state/auth";
import { LoginPage } from "./pages/LoginPage";
import { SignupPage } from "./pages/SignupPage";
import { DashboardPage } from "./pages/DashboardPage";
import { LandingPage } from "./pages/LandingPage";
import { ProfilePage } from "./pages/ProfilePage";
import { PageLoader } from "./components/PageLoader";

function Protected({ children }: { children: JSX.Element }) {
  const { user, loading } = useAuth();
  if (loading) return <PageLoader label="Checking session..." />;
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

export function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route
        path="/dashboard"
        element={
          <Protected>
            <DashboardPage />
          </Protected>
        }
      />
      <Route path="/profile/:username" element={<ProfilePage />} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}
