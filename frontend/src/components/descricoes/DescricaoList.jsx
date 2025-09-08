import React, { useEffect, useState, useRef } from 'react';
import { useDescricoesList } from '../../hooks/useDescricoes.js';
import { Card, Button, Loading, ConfirmModal, Input, DetailModal } from '../common/index.js';
import { useToast } from '../../context/ToastContext.jsx';
import DescricaoTableList from './DescricaoTableList.jsx';

const DescricaoList = ({ onEdit, onCreate }) => {
  const {
    descricoes,
    loading,
    error,
    pagination,
    loadDescricoes,
    search,
    clearSearch,
    filters,
    deleteDescricao,
    sortBy,
    changePage,
    changeLimit
  } = useDescricoesList();
  
  const { toast } = useToast();
  const [descricaoToDelete, setDescricaoToDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [detailModal, setDetailModal] = useState({ open: false, descricao: null });
  
  // Ref para controlar se o componente está montado
  const isMounted = useRef(false);
  // Ref para armazenar a função loadDescricoes
  const loadDescricoesRef = useRef(loadDescricoes);
  // Ref para armazenar a função deleteDescricao
  const deleteDescricaoRef = useRef(deleteDescricao);

  // Atualizar refs quando os valores mudarem
  useEffect(() => {
    loadDescricoesRef.current = loadDescricoes;
    deleteDescricaoRef.current = deleteDescricao;
  }, [loadDescricoes, deleteDescricao]);

  // Carregar descrições ao montar o componente
  useEffect(() => {
    isMounted.current = true;
    
    // Carregar descrições apenas quando o componente estiver montado
    if (isMounted.current) {
      loadDescricoesRef.current();
    }
    
    // Limpar flag ao desmontar
    return () => {
      isMounted.current = false;
    };
  }, []); // Remover dependência de loadDescricoes para evitar loop

  // Lidar com erros
  useEffect(() => {
    if (error) {
      toast.error(error);
      // clearError is not available in useDescricoesList, we need to get it from context directly
    }
  }, [error, toast]);

  // Lidar com busca
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      search(searchTerm.trim());
    }
  };

  // Lidar com limpeza de busca
  const handleClearSearch = () => {
    setSearchTerm('');
    clearSearch();
  };

  // Abrir formulário para nova descrição
  const handleCreate = () => {
    onCreate(); // Chamar a função onCreate passada como prop
  };

  // Abrir formulário para editar descrição
  const handleEditDescricao = (descricao) => {
    onEdit(descricao); // Chamar a função onEdit passada como prop
  };

  // Lidar com visualização de detalhes
  const handleViewDetails = (descricao) => {
    setDetailModal({ open: true, descricao });
  };

  // Confirmar exclusão
  const handleConfirmDelete = (descricao) => {
    setDescricaoToDelete(descricao);
  };

  // Executar exclusão
  const handleDelete = async () => {
    if (!descricaoToDelete) return;
    
    setDeleteLoading(true);
    
    try {
      await deleteDescricaoRef.current(descricaoToDelete.id);
      toast.success('Descrição excluída com sucesso!');
      setDescricaoToDelete(null);
      loadDescricoesRef.current(); // Recarregar a lista usando o hook
    } catch (error) {
      toast.error('Erro ao excluir descrição');
    } finally {
      setDeleteLoading(false);
    }
  };

  // Cancelar exclusão
  const handleCancelDelete = () => {
    setDescricaoToDelete(null);
  };

  if (loading && descricoes.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loading />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Descrições</h1>
          <p className="text-sm text-gray-600 mt-1">
            {pagination.total} descrição(ões) cadastrado(s)
          </p>
        </div>
        
        <div className="mt-4 sm:mt-0">
          <Button
            size="small"
            onClick={handleCreate}
            leftIcon={
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            }
          >
            Nova Descrição
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
                label="Buscar descrições"
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Digite o código ou descrição"
                leftIcon={
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                }
              />
            </div>

            {/* Botões de ação */}
            <div className="flex space-x-2">
              <Button 
                type="submit" 
                size="small"
                disabled={loading || !searchTerm.trim()}
              >
                {loading ? 'Buscando...' : 'Buscar'}
              </Button>
              
              {filters.search && (
                <Button 
                  type="button" 
                  variant="secondary" 
                  size="small"
                  onClick={handleClearSearch}
                  disabled={loading}
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

      {/* Lista de descrições */}
      <DescricaoTableList
        descricoes={descricoes}
        loading={loading}
        onEdit={handleEditDescricao}
        onDelete={handleConfirmDelete}
        onView={handleViewDetails}
        sortBy={sortBy} // Passar função de ordenação
        currentSort={{ // Passar informações atuais de ordenação
          sortBy: filters.sortBy,
          sortOrder: filters.sortOrder
        }}
      />

      {/* Mensagem de erro */}
      {error && (
        <Card className="text-center py-8">
          <svg className="h-12 w-12 text-red-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Erro ao carregar descrições
          </h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button onClick={() => loadDescricoes()}>
            Tentar novamente
          </Button>
        </Card>
      )}

      {/* Paginação */}
      <Card>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          {/* Informações da página */}
          <div className="text-sm text-gray-700">
            Página {pagination.page} de {pagination.totalPages || 1} 
            ({pagination.total} descrições)
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
              {pagination.page} / {pagination.totalPages || 1}
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

      {/* Modal de confirmação de exclusão */}
      <ConfirmModal
        isOpen={!!descricaoToDelete}
        onClose={handleCancelDelete}
        onConfirm={handleDelete}
        title="Excluir Descrição"
        message={`Tem certeza que deseja excluir a descrição "${descricaoToDelete?.descricao}"? Esta ação não pode ser desfeita.`}
        confirmText="Excluir"
        cancelText="Cancelar"
        loading={deleteLoading}
      />

      {/* Modal de detalhes */}
      <DetailModal
        isOpen={detailModal.open}
        onClose={() => setDetailModal({ open: false, descricao: null })}
        title="Detalhes da Descrição"
      >
        {detailModal.descricao && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Código</label>
                <p className="mt-1 text-sm text-gray-900">{detailModal.descricao.codigo}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Usuário</label>
                <p className="mt-1 text-sm text-gray-900">{detailModal.descricao.useradd || '-'}</p>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700">Descrição</label>
                <p className="mt-1 text-sm text-gray-900">{detailModal.descricao.descricao}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Subconta SIAFI</label>
                <p className="mt-1 text-sm text-gray-900">{detailModal.descricao.subcontasiafi || '-'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Vida Útil</label>
                <p className="mt-1 text-sm text-gray-900">
                  {detailModal.descricao.vidautil ? `${detailModal.descricao.vidautil} ano(s)` : '-'}
                </p>
              </div>
            </div>
          </div>
        )}
      </DetailModal>

    </div>
  );
};

export default DescricaoList;