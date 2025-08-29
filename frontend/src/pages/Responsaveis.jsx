import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ResponsavelProvider } from '../context/ResponsavelContext.jsx';
import { useProtectedRoute } from '../hooks/useAuth.js';
import Header from '../components/layout/Header.jsx';
import ResponsavelList from '../components/responsaveis/ResponsavelList.jsx';
import ResponsavelSearch from '../components/responsaveis/ResponsavelSearch.jsx';
import ResponsavelForm from '../components/responsaveis/ResponsavelForm.jsx';
import { Card, Button, Modal, FormModal } from '../components/common/index.js';

const ResponsaveisPage = () => {
  // Proteger rota
  const { loading: authLoading } = useProtectedRoute();
  const navigate = useNavigate();
  
  // Estados locais
  const [activeTab, setActiveTab] = useState('list');
  const [formModal, setFormModal] = useState({ open: false, responsavel: null });
  const [selectedResponsavel, setSelectedResponsavel] = useState(null);

  // Se ainda está carregando autenticação, não renderizar
  if (authLoading) {
    return null;
  }

  // Abas disponíveis
  const tabs = [
    {
      id: 'list',
      name: 'Lista',
      icon: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
        </svg>
      ),
    },
    {
      id: 'search',
      name: 'Buscar',
      icon: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      ),
    },
    {
      id: 'create',
      name: 'Novo',
      icon: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
      ),
    },
  ];

  // Lidar com criação
  const handleCreate = () => {
    setFormModal({ open: true, responsavel: null });
  };

  // Lidar com edição
  const handleEdit = (responsavel) => {
    setFormModal({ open: true, responsavel });
  };

  // Lidar com sucesso do formulário
  const handleFormSuccess = () => {
    setFormModal({ open: false, responsavel: null });
    if (activeTab !== 'list') {
      setActiveTab('list');
    }
  };

  // Lidar com seleção de responsável na busca
  const handleResponsavelSelect = (responsavel) => {
    setSelectedResponsavel(responsavel);
  };

  return (
    <ResponsavelProvider>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <Header />

        {/* Navegação */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              {/* Breadcrumb */}
              <nav className="flex items-center space-x-2 text-sm">
                <button
                  onClick={() => navigate('/dashboard')}
                  className="text-gray-500 hover:text-gray-700 transition-colors"
                >
                  Dashboard
                </button>
                <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
                <span className="text-gray-900 font-medium">Responsáveis</span>
              </nav>

              {/* Ações rápidas */}
              <div className="flex items-center space-x-2">
                <Button
                  variant="secondary"
                  size="small"
                  onClick={() => navigate('/dashboard')}
                >
                  <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  Voltar
                </Button>
                
                <Button
                  size="small"
                  onClick={handleCreate}
                >
                  <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Novo
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Conteúdo principal */}
        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            {/* Cabeçalho da página */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900">
                Gestão de Responsáveis
              </h1>
              <p className="mt-2 text-sm text-gray-600">
                Gerencie o cadastro de responsáveis, consulte informações e mantenha os dados atualizados
              </p>
            </div>

            {/* Abas de navegação */}
            <div className="mb-6">
              <div className="border-b border-gray-200">
                <nav className="-mb-px flex space-x-8">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`
                        group inline-flex items-center py-2 px-1 border-b-2 font-medium text-sm
                        ${activeTab === tab.id
                          ? 'border-primary-500 text-primary-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        }
                      `}
                    >
                      <span className="mr-2">{tab.icon}</span>
                      {tab.name}
                    </button>
                  ))}
                </nav>
              </div>
            </div>

            {/* Conteúdo das abas */}
            <div className="tab-content">
              {activeTab === 'list' && (
                <ResponsavelList
                  onEdit={handleEdit}
                  onCreate={handleCreate}
                />
              )}

              {activeTab === 'search' && (
                <ResponsavelSearch
                  onResponsavelSelect={handleResponsavelSelect}
                />
              )}

              {activeTab === 'create' && (
                <div className="max-w-2xl mx-auto">
                  <ResponsavelForm
                    onSuccess={() => setActiveTab('list')}
                    onCancel={() => setActiveTab('list')}
                  />
                </div>
              )}
            </div>
          </div>
        </main>

        {/* Modal de formulário */}
        <FormModal
          isOpen={formModal.open}
          onClose={() => setFormModal({ open: false, responsavel: null })}
          title={formModal.responsavel ? 'Editar Responsável' : 'Novo Responsável'}
          size="medium"
          onSubmit={(e) => {
            e.preventDefault();
            // O form interno gerencia o submit
          }}
        >
          <ResponsavelForm
            responsavel={formModal.responsavel}
            onSuccess={handleFormSuccess}
            showButtons={false}
          />
        </FormModal>

        {/* Modal de detalhes do responsável selecionado */}
        {selectedResponsavel && (
          <Modal
            isOpen={!!selectedResponsavel}
            onClose={() => setSelectedResponsavel(null)}
            title={`Detalhes - ${selectedResponsavel.nome}`}
            size="medium"
            footer={
              <div className="flex justify-end space-x-2">
                <Button
                  variant="secondary"
                  onClick={() => setSelectedResponsavel(null)}
                >
                  Fechar
                </Button>
                <Button
                  onClick={() => {
                    handleEdit(selectedResponsavel);
                    setSelectedResponsavel(null);
                  }}
                >
                  Editar
                </Button>
              </div>
            }
          >
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Nome
                  </label>
                  <p className="mt-1 text-sm text-gray-900">
                    {selectedResponsavel.nome}
                  </p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Matrícula
                  </label>
                  <p className="mt-1 text-sm text-gray-900">
                    {selectedResponsavel.matricula}
                  </p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Permissão
                  </label>
                  <p className="mt-1 text-sm text-gray-900">
                    {selectedResponsavel.permissao || 'Não definido'}
                  </p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    ID
                  </label>
                  <p className="mt-1 text-sm text-gray-900">
                    {selectedResponsavel.id}
                  </p>
                </div>
              </div>
            </div>
          </Modal>
        )}
      </div>
    </ResponsavelProvider>
  );
};

export default ResponsaveisPage;