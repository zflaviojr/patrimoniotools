import React from 'react';
import { useProtectedRoute } from '../hooks/useAuth.js';
import Dashboard from '../components/layout/Dashboard.jsx';

const DashboardPage = () => {
  // Proteger rota - redireciona para login se não autenticado
  const { loading } = useProtectedRoute();

  // O componente Dashboard já lida com o loading
  return <Dashboard />;
};

export default DashboardPage;