import React, { useEffect } from 'react';
import { useResponsavelForm } from '../../hooks/useResponsaveis.js';
import { Input, Button, Card } from '../common/index.js';

const ResponsavelForm = ({ 
  responsavel = null, 
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
    resetForm,
    isValid
  } = useResponsavelForm(responsavel);

  // Resetar formulário quando responsável mudar
  useEffect(() => {
    resetForm();
  }, [responsavel, resetForm]);

  // Lidar com submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const success = await submitForm();
    
    if (success && onSuccess) {
      onSuccess();
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Título */}
        <div className="text-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900">
            {responsavel ? 'Editar Responsável' : 'Novo Responsável'}
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            {responsavel 
              ? 'Atualize as informações do responsável' 
              : 'Preencha os dados do novo responsável'
            }
          </p>
        </div>

        {/* Campo Nome */}
        <Input
          label="Nome"
          type="text"
          value={formData.nome}
          onChange={(e) => updateField('nome', e.target.value)}
          error={errors.nome}
          placeholder="Digite o nome completo"
          required
          disabled={loading}
          leftIcon={
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          }
        />

        {/* Campo Matrícula */}
        <Input
          label="Matrícula"
          type="text"
          value={formData.matricula}
          onChange={(e) => updateField('matricula', e.target.value.toUpperCase())}
          error={errors.matricula}
          placeholder="Digite a matrícula"
          required
          disabled={loading}
          help="Apenas letras, números, pontos, traços e sublinhados"
          leftIcon={
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          }
        />

        {/* Campo Permissão */}
        <Input
          label="Permissão"
          type="number"
          value={formData.permissao}
          onChange={(e) => updateField('permissao', e.target.value)}
          error={errors.permissao}
          placeholder="0-10 (opcional)"
          min="0"
          max="10"
          disabled={loading}
          help="Nível de permissão de 0 a 10 (opcional)"
          leftIcon={
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
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
              {responsavel ? 'Atualizar' : 'Criar'}
            </Button>
          </div>
        )}
      </form>
    </Card>
  );
};

export default ResponsavelForm;