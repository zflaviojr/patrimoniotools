import React, { useEffect, useState } from 'react';
import { useDescricaoForm } from '../../hooks/useDescricoes.js';
import { Input, Button, Card, ConfirmModal } from '../common/index.js';

const DescricaoForm = ({ 
  descricao = null, 
  onSuccess, 
  onCancel,
  showButtons = true
}) => {
  const {
    formData,
    errors,
    loading,
    updateField,
    submitForm,
    submitFormWithoutValidation,
    resetForm,
    validateForm,
    isValid
  } = useDescricaoForm(descricao);

  // Estado para o modal de confirmação
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  // Resetar formulário quando descrição mudar
  useEffect(() => {
    resetForm();
  }, [descricao, resetForm]);

  // Lidar com submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validar formulário primeiro - se falhar, não mostrar modal
    if (!validateForm()) {
      return; // Para aqui se validação falhar, erros já são exibidos nos campos
    }
    
    // Mostrar modal de confirmação apenas após validação OK
    setShowConfirmModal(true);
  };

  // Confirmar e executar submit
  const handleConfirmSubmit = async () => {
    setShowConfirmModal(false);
    
    // Usar função sem validação pois já foi validado antes de mostrar o modal
    const success = await submitFormWithoutValidation();
    
    if (success && onSuccess) {
      onSuccess();
    }
  };

  return (
    <>
      <Card className="w-full max-w-md mx-auto">
        <form 
          onSubmit={handleSubmit} 
          className="space-y-4"
        >
          {/* Título */}
          <div className="text-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900">
              {descricao ? 'Editar Descrição' : 'Nova Descrição'}
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              {descricao 
                ? 'Atualize as informações da descrição' 
                : 'Preencha os dados da nova descrição'
              }
            </p>
          </div>

          {/* Campo Descrição */}
          <Input
            label="Descrição"
            type="text"
            value={formData.descricao}
            onChange={(e) => updateField('descricao', e.target.value)}
            error={errors.descricao}
            placeholder="Digite a descrição"
            required
            disabled={loading}
            leftIcon={
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            }
          />

          {/* Campo Subconta SIAFI */}
          <Input
            label="Subconta SIAFI"
            type="text"
            value={formData.subcontasiafi}
            onChange={(e) => updateField('subcontasiafi', e.target.value)}
            error={errors.subcontasiafi}
            placeholder="Digite a subconta SIAFI"
            disabled={loading}
            leftIcon={
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
          />

          {/* Campo Vida Útil */}
          <Input
            label="Vida Útil (anos)"
            type="number"
            value={formData.vidautil}
            onChange={(e) => updateField('vidautil', e.target.value)}
            error={errors.vidautil}
            placeholder="Digite a vida útil em anos"
            min="0"
            max="100"
            disabled={loading}
            leftIcon={
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
          />

          {/* Campo Usuário */}
          <Input
            label="Usuário"
            type="text"
            value={formData.useradd}
            onChange={(e) => updateField('useradd', e.target.value)}
            error={errors.useradd}
            placeholder="Digite o nome do usuário"
            disabled={loading}
            leftIcon={
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            }
          />

          {/* Botões */}
          {showButtons && (
            <div className="flex justify-end space-x-3 pt-4">
              <Button
                type="button"
                variant="secondary"
                onClick={onCancel}
                disabled={loading}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                loading={loading}
                disabled={!isValid}
              >
                {descricao ? 'Atualizar' : 'Criar'}
              </Button>
            </div>
          )}
        </form>
      </Card>

      {/* Modal de Confirmação */}
      <ConfirmModal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={handleConfirmSubmit}
        title={descricao ? 'Confirmar Edição' : 'Confirmar Cadastro'}
        message={
          descricao 
            ? `Tem certeza que deseja atualizar os dados da descrição "${formData.descricao}"?`
            : `Tem certeza que deseja cadastrar a descrição "${formData.descricao}"?`
        }
        confirmText={descricao ? 'Atualizar' : 'Cadastrar'}
        cancelText="Cancelar"
        loading={loading}
      />
    </>
  );
};

export default DescricaoForm;