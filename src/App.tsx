import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";
import { AuthProvider } from "./context/AuthContext.jsx";
import { ProtectedRoute } from "./components/common/ProtectedRoute.jsx";
import { Navbar } from "./components/common/Navbar.jsx";
import { useAuth } from "./hooks/useAuth.js";

// Pages
import LoginPage from "./pages/LoginPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import GeneratorPage from "./pages/GeneratorPage.jsx";
import GalleryPage from "./pages/GalleryPage.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";

const PageLoader = () => (
  <div className="flex min-h-screen items-center justify-center bg-gradient-subtle">
    <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary-200 border-t-white" />
  </div>
);

const AuthRedirect = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return <PageLoader />;

  return <Navigate to={isAuthenticated ? "/generate" : "/login"} replace />;
};

const PublicOnlyRoute = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return <PageLoader />;

  return isAuthenticated ? <Navigate to="/generate" replace /> : <Outlet />;
};

const AuthLayout = () => {
  return <Outlet />;
};

const MainLayout = () => (
  <div className="app-page">
    <Navbar />
    <main>
      <style>
        {`
          @keyframes soft-rise {
            0% { opacity: 0; transform: translateY(12px); }
            100% { opacity: 1; transform: translateY(0); }
          }
          .soft-rise {
            animation: soft-rise 420ms ease-out both;
          }
        `}
      </style>
      <Outlet />
    </main>
  </div>
);

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route element={<PublicOnlyRoute />}>
            <Route element={<AuthLayout />}>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
            </Route>
          </Route>

          <Route
            element={
              <ProtectedRoute>
                <MainLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/generate" element={<GeneratorPage />} />
            <Route path="/gallery" element={<GalleryPage />} />
            <Route path="/profile" element={<ProfilePage />} />
          </Route>

          <Route path="/" element={<AuthRedirect />} />
          <Route path="*" element={<AuthRedirect />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
