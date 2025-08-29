import React, { useEffect, useState } from 'react';
import { useResponsaveisList, useResponsavelActions } from '../../hooks/useResponsaveis.js';
import { 
  Card, 
  Button, 
  Input, 
  ResponsavelCard, 
  CardLoading, 
  ConfirmModal,
  DetailModal 
} from '../common/index.js';

const ResponsavelList = ({ onEdit, onCreate }) => {
  const {
    responsaveis,
    loading,
    error,
    pagination,
    loadResponsaveis,
    changePage,
    changeLimit,
    search,
    clearSearch,
    filters
  } = useResponsaveisList();

  const { handleDelete, actionLoading } = useResponsavelActions();

  // Estados locais
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteModal, setDeleteModal] = useState({ open: false, responsavel: null });
  const [detailModal, setDetailModal] = useState({ open: false, responsavel: null });

  // Carregar responsáveis na montagem
  useEffect(() => {
    loadResponsaveis();
  }, []);

  // Lidar com busca
  const handleSearch = (e) => {
    e.preventDefault();
    search(searchTerm);
  };

  // Lidar com limpeza de busca
  const handleClearSearch = () => {
    setSearchTerm('');
    clearSearch();
  };

  // Lidar com exclusão
  const handleDeleteClick = (responsavel) => {
    setDeleteModal({ open: true, responsavel });
  };

  const confirmDelete = async () => {
    const success = await handleDelete(deleteModal.responsavel.id);
    if (success) {
      setDeleteModal({ open: false, responsavel: null });
    }
  };

  // Lidar com visualização de detalhes
  const handleViewDetails = (responsavel) => {
    setDetailModal({ open: true, responsavel });
  };

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Responsáveis
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            {pagination.total} responsável(eis) cadastrado(s)
          </p>
        </div>
        
        <div className="mt-4 sm:mt-0">
          <Button onClick={onCreate}>
            <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Novo Responsável
          </Button>
        </div>
      </div>

      {/* Filtros e busca */}
      <Card>
        <form onSubmit={handleSearch} className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-end sm:space-x-4 space-y-4 sm:space-y-0">
            {/* Campo de busca */}
            <div className="flex-1">
              <Input
                label="Buscar responsáveis"
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Digite o nome ou matrícula"
                leftIcon={
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                }
              />
            </div>

            {/* Botões de ação */}
            <div className="flex space-x-2">
              <Button type="submit" disabled={loading}>
                Buscar
              </Button>
              
              {filters.search && (
                <Button 
                  type="button" 
                  variant="secondary" 
                  onClick={handleClearSearch}
                >
                  Limpar
                </Button>
              )}
            </div>
          </div>

          {/* Filtro aplicado */}
          {filters.search && (
            <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-blue-800">
                  Filtrando por: <strong>"{filters.search}"</strong>
                </span>
                <button
                  type="button"
                  onClick={handleClearSearch}
                  className="text-blue-600 hover:text-blue-800"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          )}
        </form>
      </Card>

      {/* Lista de responsáveis */}
      {loading ? (
        <CardLoading count={6} />
      ) : error ? (
        <Card className="text-center py-8">
          <svg className="h-12 w-12 text-red-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Erro ao carregar responsáveis
          </h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button onClick={() => loadResponsaveis()}>
            Tentar novamente
          </Button>
        </Card>
      ) : responsaveis.length === 0 ? (
        <Card className="text-center py-8">
          <svg className="h-12 w-12 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-3.5a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {filters.search ? 'Nenhum responsável encontrado' : 'Nenhum responsável cadastrado'}
          </h3>
          <p className="text-gray-600 mb-4">
            {filters.search 
              ? 'Tente ajustar os filtros de busca'
              : 'Comece criando o primeiro responsável'
            }
          </p>
          <Button onClick={onCreate}>
            Novo Responsável
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {responsaveis.map((responsavel) => (
            <ResponsavelCard
              key={responsavel.id}
              responsavel={responsavel}
              onView={() => handleViewDetails(responsavel)}
              onEdit={() => onEdit(responsavel)}
              onDelete={() => handleDeleteClick(responsavel)}
            />
          ))}
        </div>
      )}

      {/* Paginação */}
      {pagination.totalPages > 1 && (
        <Card>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            {/* Informações da página */}
            <div className="text-sm text-gray-700">
              Página {pagination.page} de {pagination.totalPages} 
              ({pagination.total} responsáveis)
            </div>

            {/* Controles de paginação */}
            <div className="flex items-center space-x-2">
              <Button
                variant="secondary"
                size="small"
                onClick={() => changePage(pagination.page - 1)}
                disabled={!pagination.hasPrev || loading}
              >
                Anterior
              </Button>
              
              <span className="text-sm text-gray-500">
                {pagination.page} / {pagination.totalPages}
              </span>
              
              <Button
                variant="secondary"
                size="small"
                onClick={() => changePage(pagination.page + 1)}
                disabled={!pagination.hasNext || loading}
              >
                Próxima
              </Button>
            </div>

            {/* Seletor de itens por página */}
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-700">Itens por página:</span>
              <select
                value={pagination.limit}
                onChange={(e) => changeLimit(parseInt(e.target.value))}
                className="border border-gray-300 rounded px-2 py-1 text-sm"
                disabled={loading}
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
            </div>
          </div>
        </Card>
      )}

      {/* Modal de confirmação de exclusão */}
      <ConfirmModal
        isOpen={deleteModal.open}
        onClose={() => setDeleteModal({ open: false, responsavel: null })}
        onConfirm={confirmDelete}
        title="Excluir Responsável"
        message={`Tem certeza que deseja excluir o responsável "${deleteModal.responsavel?.nome}"? Esta ação não pode ser desfeita.`}
        confirmText="Excluir"
        cancelText="Cancelar"
        variant="danger"
        loading={actionLoading}
      />

      {/* Modal de detalhes */}
      <DetailModal
        isOpen={detailModal.open}
        onClose={() => setDetailModal({ open: false, responsavel: null })}
        title={`Detalhes - ${detailModal.responsavel?.nome}`}
        data={detailModal.responsavel}
      />
    </div>
  );
};

export default ResponsavelList;