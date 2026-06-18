import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { SocketProvider } from './context/SocketContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import StoriesFeed from './pages/StoriesFeed';
import Dashboard from './pages/Dashboard';
import CreateStory from './pages/CreateStory';
import StoryDetails from './pages/StoryDetails';
import PublicStories from './pages/PublicStories';
import PublicStoryDetails from './pages/PublicStoryDetails';

function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <AuthProvider>
          <SocketProvider>
            <Routes>
              {/* Unprotected Auth Routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Public feed and reading routes */}
              <Route
                path="/public-stories"
                element={
                  <Layout>
                    <PublicStories />
                  </Layout>
                }
              />
              <Route
                path="/public-story/:id"
                element={
                  <Layout>
                    <PublicStoryDetails />
                  </Layout>
                }
              />

            {/* General Protected Routes (Any logged-in role) */}
            <Route element={<ProtectedRoute />}>
              <Route
                path="/"
                element={
                  <Layout>
                    <StoriesFeed />
                  </Layout>
                }
              />
              <Route
                path="/story/:id"
                element={
                  <Layout>
                    <StoryDetails />
                  </Layout>
                }
              />
            </Route>

            {/* Contributor, Author, Admin Protected Workspace */}
            <Route element={<ProtectedRoute allowedRoles={['contributor', 'author', 'admin']} />}>
              <Route
                path="/dashboard"
                element={
                  <Layout>
                    <Dashboard />
                  </Layout>
                }
              />
            </Route>

            {/* Author and Admin Story Creation */}
            <Route element={<ProtectedRoute allowedRoles={['author', 'admin']} />}>
              <Route
                path="/story/create"
                element={
                  <Layout>
                    <CreateStory />
                  </Layout>
                }
              />
            </Route>

            {/* Catch-all Redirect */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </SocketProvider>
      </AuthProvider>
    </ToastProvider>
  </BrowserRouter>
);
}

export default App;
