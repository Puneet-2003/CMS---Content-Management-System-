import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { Toaster } from "react-hot-toast";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Posts from "./pages/Posts";
import PostForm from "./pages/PostForm";
import PostView from "./pages/PostView"; // Add this import
import Pages from "./pages/Pages";
import PageForm from "./pages/PageForm";
import PageView from "./pages/PageView"; // Add this import
import MediaManager from "./pages/MediaManager";
import Layout from "./components/Layout";

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return user ? children : <Navigate to="/login" />;
};

const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return !user ? children : <Navigate to="/" />;
};

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Toaster position="top-right" />
        <Routes>
          <Route
            path="/login"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />
          <Route
            path="/register"
            element={
              <PublicRoute>
                <Register />
              </PublicRoute>
            }
          />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Layout>
                  <Dashboard />
                </Layout>
              </ProtectedRoute>
            }
          />
          
    
          <Route
            path="/posts"
            element={
              <ProtectedRoute>
                <Layout>
                  <Posts />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/posts/create"
            element={
              <ProtectedRoute>
                <Layout>
                  <PostForm />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/posts/edit/:id"
            element={
              <ProtectedRoute>
                <Layout>
                  <PostForm />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/posts/view/:id"
            element={
              <ProtectedRoute>
                <Layout>
                  <PostView />
                </Layout>
              </ProtectedRoute>
            }
          />

         
          <Route
            path="/pages"
            element={
              <ProtectedRoute>
                <Layout>
                  <Pages />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/pages/create"
            element={
              <ProtectedRoute>
                <Layout>
                  <PageForm />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/pages/edit/:id"
            element={
              <ProtectedRoute>
                <Layout>
                  <PageForm />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/pages/view/:id"
            element={
              <ProtectedRoute>
                <Layout>
                  <PageView />
                </Layout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/media"
            element={
              <ProtectedRoute>
                <Layout>
                  <MediaManager />
                </Layout>
              </ProtectedRoute>
            }
          />

          
          <Route
            path="*"
            element={
              <ProtectedRoute>
                <Navigate to="/" replace />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;