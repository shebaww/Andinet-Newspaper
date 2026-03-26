// src/App.jsx - Replace with this fixed version
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Login from "./components/Login";
import ForgotPassword from "./components/ForgotPassword";
import Signup from "./components/Signup";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import HomePage from "./components/HomePage";
import Dashboard from "./components/Dashboard";
import CreatePost from "./components/CreatePost";
import Profile from "./components/Profile";
import PostDetail from "./components/PostDetail";
import Donate from "./components/Donate";
import EditPost from "./components/EditPost";
import About from "./components/About";
import Contact from "./components/Contact";
import NotFound from "./components/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";
import ErrorBoundary from "./components/common/ErrorBoundary";
import { initGA, trackPageView } from './utils/analytics';

function AppRoutes() {
  const { loading } = useAuth();
  const location = useLocation();

  useEffect(() => {
    trackPageView(location.pathname);
  }, [location]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <ErrorBoundary>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/post/:id" element={<PostDetail />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route
          path="/edit-post/:id"
          element={
            <ProtectedRoute allowedRoles={["admin", "editor"]}>
              <EditPost />
            </ProtectedRoute>
          }
        />
        <Route path="/donate" element={<Donate />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/signup" element={<Signup />} />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute allowedRoles={["admin", "editor"]}>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/create-post"
          element={
            <ProtectedRoute allowedRoles={["admin", "editor"]}>
              <CreatePost />
            </ProtectedRoute>
          }
        />
        {/* 404 catch-all route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </ErrorBoundary>
  );
}

function App() {
  useEffect(() => {
    initGA();
  }, []);

  return (
    <Router>
      <AuthProvider>
        <a href="#main-content" className="skip-link">
          Skip to Content
        </a>
        <Navbar />
        <main id="main-content" style={{ minHeight: "calc(100vh - 200px)" }}>
          <AppRoutes />
        </main>
        <Footer />
      </AuthProvider>
    </Router>
  );
}

export default App;
