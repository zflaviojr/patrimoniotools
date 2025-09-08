import React, { useEffect, useState, useRef } from 'react';
import { useDescricoesList } from '../../hooks/useDescricoes.js';
import { Card, Button, Loading, ConfirmModal, Input, DetailModal } from '../common/index.js';
import { useToast } from '../../context/ToastContext.jsx';
import DescricaoForm from './DescricaoForm.jsx';
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
    deleteDescricao // Add deleteDescricao from the hook
  } = useDescricoesList();
  
  const { toast } = useToast();
  const [showForm, setShowForm] = useState(false);
  const [editingDescricao, setEditingDescricao] = useState(null);
  const [descricaoToDelete, setDescricaoToDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [detailModal, setDetailModal] = useState({ open: false, descricao: null }); // Adicionar estado para modal de detalhes
  
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
    setEditingDescricao(null);
    setShowForm(true);
  };

  // Abrir formulário para editar descrição
  const handleEditDescricao = (descricao) => {
    setEditingDescricao(descricao);
    setShowForm(true);
  };

  // Lidar com visualização de detalhes
  const handleViewDetails = (descricao) => {
    setDetailModal({ open: true, descricao });
  };

  // Fechar formulário
  const handleCloseForm = () => {
    setShowForm(false);
    setEditingDescricao(null);
  };

  // Sucesso ao salvar descrição
  const handleSaveSuccess = () => {
    handleCloseForm();
    loadDescricoesRef.current(); // Recarregar a lista usando o hook
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
          <p className="text-gray-600 mt-1">
            Gerencie as descrições de itens do sistema
          </p>
        </div>
        
        <div className="mt-4 sm:mt-0">
          <Button
            size="small"  // Adicionar tamanho small para corresponder ao botão de responsáveis
            onClick={handleCreate}
            
            leftIcon={
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">  // Ajustar tamanho do ícone
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
      <Card className="overflow-hidden">
        <DescricaoTableList
          descricoes={descricoes}
          onEdit={handleEditDescricao}
          onDelete={handleConfirmDelete}
          onView={handleViewDetails} // Passar a função onView para o componente
          loading={loading}
        />
      </Card>

      {/* Paginação */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-600">
            Mostrando {Math.min(descricoes.length, pagination.limit)} de {pagination.total} registros
          </div>
          
          <div className="flex gap-2">
            <Button
              variant="secondary"
              onClick={() => loadDescricoesRef.current({ page: pagination.page - 1 })}
              disabled={!pagination.hasPrev}
            >
              Anterior
            </Button>
            
            <Button
              variant="secondary"
              onClick={() => loadDescricoesRef.current({ page: pagination.page + 1 })}
              disabled={!pagination.hasNext}
            >
              Próximo
            </Button>
          </div>
        </div>
      )}

      {/* Formulário em modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
            <DescricaoForm
              descricao={editingDescricao}
              onSuccess={handleSaveSuccess}
              onCancel={handleCloseForm}
            />
          </div>
        </div>
      )}

      {/* Modal de confirmação de exclusão */}
      <ConfirmModal
        isOpen={!!descricaoToDelete}
        onClose={handleCancelDelete}
        onConfirm={handleDelete}
        title="Confirmar Exclusão"
        message={`Tem certeza que deseja excluir a descrição "${descricaoToDelete?.descricao}"? Esta ação não pode ser desfeita.`}
        confirmText="Excluir"
        cancelText="Cancelar"
        loading={deleteLoading}
        destructive
      />

      {/* Modal de detalhes */}
      <DetailModal
        isOpen={detailModal.open}
        onClose={() => setDetailModal({ open: false, descricao: null })}
        title={`Detalhes - ${detailModal.descricao?.descricao}`}
        data={detailModal.descricao}
      />
    </div>
  );
};

export default DescricaoList;