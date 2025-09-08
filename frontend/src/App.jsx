import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx';
import { ToastProvider } from './context/ToastContext.jsx';
import ProtectedRoute from './components/auth/ProtectedRoute.jsx';
import Layout from './components/layout/Layout.jsx';

// Páginas
import Login from './pages/Login.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Responsaveis from './pages/Responsaveis.jsx';
import Descricoes from './pages/Descricoes.jsx';
import Users from './pages/Users.jsx';
import UserProfile from './pages/UserProfile.jsx';

// Estilos
import './index.css';

function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <Router>
          <div className="App">
            <Routes>
              {/* Rota pública - Login */}
              <Route path="/login" element={<Login />} />
              
              {/* Rotas protegidas com Layout */}
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute>
                    <Layout>
                      <Dashboard />
                    </Layout>
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="/responsaveis" 
                element={
                  <ProtectedRoute>
                    <Layout>
                      <Responsaveis />
                    </Layout>
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="/descricoes" 
                element={
                  <ProtectedRoute>
                    <Layout>
                      <Descricoes />
                    </Layout>
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="/descricoes/edit/:id" 
                element={
                  <ProtectedRoute>
                    <Layout>
                      <Descricoes />
                    </Layout>
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="/usuarios" 
                element={
                  <ProtectedRoute>
                    <Layout>
                      <Users />
                    </Layout>
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="/profile" 
                element={
                  <ProtectedRoute>
                    <Layout>
                      <UserProfile />
                    </Layout>
                  </ProtectedRoute>
                } 
              />
              
              {/* Rota raiz - redirecionar para dashboard */}
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              
              {/* Rota 404 - redirecionar para dashboard */}
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </div>
        </Router>
      </AuthProvider>
    </ToastProvider>
  );
}

export default App;