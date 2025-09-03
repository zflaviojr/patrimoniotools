import React from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import ModuleSelector from './ModuleSelector.jsx';
import { PageLoading } from '../common/index.js';

const Dashboard = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <PageLoading text="Carregando dashboard..." />;
  }

  return (
    <div className="flex-1 bg-gray-50">
      {/* Conteúdo principal */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Cabeçalho do dashboard */}
        <div className="px-4 py-6 sm:px-0">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
              Bem-vindo, {user?.username}!
            </h1>
            <p className="mt-2 text-lg text-gray-600">
              Selecione um módulo para começar
            </p>
          </div>

          {/* Seletor de módulos */}
          <ModuleSelector />
        </div>
      </main>
    </div>
  );
};

export default Dashboard;