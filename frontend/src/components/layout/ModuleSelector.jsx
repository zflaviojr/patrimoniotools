import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { ModuleCard } from '../common/index.js';

const ModuleSelector = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  // Verificar se o usuário é admin
  const isAdmin = user?.username === 'admin';

  // Definir módulos disponíveis
  const baseModules = [
    {
      id: 'responsaveis',
      title: 'Responsáveis',
      description: 'Gerenciar cadastro de responsáveis, consultas e relatórios',
      icon: (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-3.5a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      path: '/responsaveis',
      enabled: true,
    }
  ];
  
  // Adicionar módulo de usuários se for admin
  const adminModules = isAdmin ? [
    {
      id: 'usuarios',
      title: 'Usuários',
      description: 'Gerenciar usuários do sistema e permissões',
      icon: (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
      path: '/usuarios',
      enabled: true,
    }
  ] : [];
  
  const modules = [...baseModules, ...adminModules];

  /* Módulos em desenvolvimento - comentados até implementação
    {
      id: 'patrimonio',
      title: 'Patrimônio',
      description: 'Controle de bens patrimoniais e equipamentos',
      icon: (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      ),
      path: '/patrimonio',
      enabled: false, // Módulo em desenvolvimento
    },
    {
      id: 'relatorios',
      title: 'Relatórios',
      description: 'Geração de relatórios e análises estatísticas',
      icon: (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      path: '/relatorios',
      enabled: false, // Módulo em desenvolvimento
    },
    {
      id: 'configuracoes',
      title: 'Configurações',
      description: 'Configurações do sistema e preferências',
      icon: (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      path: '/configuracoes',
      enabled: false, // Módulo em desenvolvimento
    }
  */

  // Lidar com clique no módulo
  const handleModuleClick = (module) => {
    if (module.enabled) {
      navigate(module.path);
    }
  };

  return (
    <div className="space-y-6">
      {/* Título da seção */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900">
          Módulos do Sistema
        </h2>
        <p className="mt-2 text-sm text-gray-600">
          Escolha um módulo para acessar suas funcionalidades
        </p>
      </div>

      {/* Grid de módulos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {modules.map((module) => (
          <div key={module.id} className="relative">
            <ModuleCard
              title={module.title}
              description={module.description}
              icon={module.icon}
              onClick={() => handleModuleClick(module)}
              disabled={!module.enabled}
              className={`
                ${module.enabled 
                  ? 'cursor-pointer hover:border-primary-300' 
                  : 'cursor-not-allowed opacity-75'
                }
              `}
            />
            
            {/* Badge de status */}
            {!module.enabled && (
              <div className="absolute top-2 right-2">
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                  Em breve
                </span>
              </div>
            )}
            
            {module.enabled && (module.id === 'responsaveis' || module.id === 'usuarios') && (
              <div className="absolute top-2 right-2">
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Disponível
                </span>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Informações adicionais */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-blue-800">
              Informações sobre os módulos
            </h3>
            <div className="mt-2 text-sm text-blue-700">
              <ul className="list-disc pl-5 space-y-1">
                <li>
                  <strong>Responsáveis:</strong> Módulo para gestão de responsáveis
                </li>
                {isAdmin && (
                  <li>
                    <strong>Usuários:</strong> Gerenciamento de usuários do sistema (apenas admin)
                  </li>
                )}
                {/* Módulos em desenvolvimento - comentados
                <li>
                  <strong>Patrimônio:</strong> Em desenvolvimento - controle de bens
                </li>
                <li>
                  <strong>Relatórios:</strong> Em desenvolvimento - análises e estatísticas
                </li>
                <li>
                  <strong>Configurações:</strong> Em desenvolvimento - configurações do sistema
                </li>
                */}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Atalhos rápidos - comentado até ter mais funcionalidades
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Ações Rápidas
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <button
            onClick={() => navigate('/responsaveis/novo')}
            className="flex items-center justify-center px-4 py-3 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors gap-2"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Novo Responsável
          </button>
          
          <button
            onClick={() => navigate('/responsaveis')}
            className="flex items-center justify-center px-4 py-3 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors gap-2"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            Buscar Responsável
          </button>
          
          <button
            className="flex items-center justify-center px-4 py-3 border border-gray-300 rounded-md text-sm font-medium text-gray-400 cursor-not-allowed gap-2"
            disabled
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Gerar Relatório
          </button>
        </div>
      </div>
      */}
    </div>
  );
};

export default ModuleSelector;