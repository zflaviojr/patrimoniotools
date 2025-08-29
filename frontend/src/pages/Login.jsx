import React from 'react';
import { useGuestRoute } from '../hooks/useAuth.js';
import LoginForm from '../components/auth/LoginForm.jsx';

const Login = () => {
  // Redirecionar se já estiver autenticado
  const { loading } = useGuestRoute();

  // Mostrar loading enquanto verifica autenticação
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  return <LoginForm />;
};

export default Login;