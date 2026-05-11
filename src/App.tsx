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
import ResetPasswordPage from "./pages/ResetPasswordPage.jsx";
import GeneratorPage from "./pages/GeneratorPage.jsx";
import GalleryPage from "./pages/GalleryPage.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";

const PageLoader = () => (
  <div className="flex min-h-screen items-center justify-center bg-gray-50">
    <div className="h-8 w-8 animate-spin rounded-full border-2 border-purple-200 border-t-purple-600" />
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
  return (
    <div className="relative min-h-screen overflow-x-hidden overflow-y-auto bg-gradient-to-br from-purple-50 via-white to-sky-50 px-4 py-8">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,rgba(168,85,247,0.16),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(14,165,233,0.16),transparent_28%)]" />

      {/* Content */}
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-md flex-col justify-center py-4">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-950 md:text-4xl">
            AI Fashion Studio
          </h1>

          <p className="mt-2 text-sm text-gray-600">
            Create stunning AI-generated fashion designs
          </p>
        </div>

        <Outlet />
      </div>
    </div>
  );
};

const MainLayout = () => (
  <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-sky-50">
    <Navbar />
    <main>
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
              <Route path="/reset-password" element={<ResetPasswordPage />} />
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
