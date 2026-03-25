import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './components/Login';
import Signup from './components/Signup';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './components/HomePage';
import Dashboard from './components/Dashboard';
import CreatePost from './components/CreatePost';
import Profile from './components/Profile';
import PostDetail from './components/PostDetail';
import Donate from './components/Donate';
import EditPost from './components/EditPost';
import About from './components/About';
import Contact from './components/Contact';
import ProtectedRoute from './components/ProtectedRoute';

function AppRoutes() {
  const { loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/post/:id" element={<PostDetail />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/edit-post/:id" element={
        <ProtectedRoute allowedRoles={['admin', 'editor']}>
          <EditPost />
        </ProtectedRoute>
      } />
      <Route path="/donate" element={<Donate />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/profile" element={
        <ProtectedRoute>
          <Profile />
        </ProtectedRoute>
      } />
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      } />
      <Route path="/create-post" element={
        <ProtectedRoute allowedRoles={['admin', 'editor']}>
          <CreatePost />
        </ProtectedRoute>
      } />
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <Navbar />
        <main style={{ minHeight: 'calc(100vh - 200px)' }}>
          <AppRoutes />
        </main>
        <Footer />
      </AuthProvider>
    </Router>
  );
}

export default App;
