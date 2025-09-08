import React, { useEffect, useState, useRef } from 'react';
import { useDescricoesList } from '../../hooks/useDescricoes.js';
import { Card, Button, Loading, ConfirmModal } from '../common/index.js';
import { useToast } from '../../context/ToastContext.jsx';
import DescricaoForm from './DescricaoForm.jsx';
import DescricaoTableList from './DescricaoTableList.jsx';
import DescricaoSearch from './DescricaoSearch.jsx';

const DescricaoList = () => {
  const {
    descricoes,
    loading,
    error,
    pagination,
    loadDescricoes, // Usar loadDescricoes do hook em vez de fetchDescricoes diretamente
    deleteDescricao,
    selectDescricao,
    clearError,
  } = useDescricoesList();
  
  const { toast } = useToast();
  const [showForm, setShowForm] = useState(false);
  const [editingDescricao, setEditingDescricao] = useState(null);
  const [descricaoToDelete, setDescricaoToDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  
  // Ref para controlar se o componente está montado
  const isMounted = useRef(false);
  // Ref para armazenar a função loadDescricoes
  const loadDescricoesRef = useRef(loadDescricoes);

  // Atualizar ref quando loadDescricoes mudar
  useEffect(() => {
    loadDescricoesRef.current = loadDescricoes;
  }, [loadDescricoes]);

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
      clearError();
    }
  }, [error, toast, clearError]);

  // Abrir formulário para nova descrição
  const handleCreate = () => {
    setEditingDescricao(null);
    setShowForm(true);
  };

  // Abrir formulário para editar descrição
  const handleEdit = (descricao) => {
    setEditingDescricao(descricao);
    setShowForm(true);
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
      await deleteDescricao(descricaoToDelete.id);
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
        
        <Button
          onClick={handleCreate}
          className="flex items-center gap-2"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Nova Descrição
        </Button>
      </div>

      {/* Componente de busca */}
      <DescricaoSearch />

      {/* Lista de descrições */}
      <Card className="overflow-hidden">
        <DescricaoTableList
          descricoes={descricoes}
          onEdit={handleEdit}
          onDelete={handleConfirmDelete}
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
    </div>
  );
};

export default DescricaoList;