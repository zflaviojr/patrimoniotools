import { useState, useCallback } from 'react';
import { useResponsaveis } from '../context/ResponsavelContext.jsx';

// Hook para gerenciar lista de responsáveis
export const useResponsaveisList = () => {
  const context = useResponsaveis();
  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
    search: '',
  });

  // Carregar responsáveis com filtros
  const loadResponsaveis = useCallback(async (newFilters = {}) => {
    const finalFilters = { ...filters, ...newFilters };
    setFilters(finalFilters);
    
    try {
      await context.fetchResponsaveis(finalFilters);
    } catch (error) {
      console.error('Erro ao carregar responsáveis:', error);
    }
  }, [context, filters]);

  // Alterar página
  const changePage = useCallback((page) => {
    loadResponsaveis({ page });
  }, [loadResponsaveis]);

  // Alterar limite por página
  const changeLimit = useCallback((limit) => {
    loadResponsaveis({ limit, page: 1 });
  }, [loadResponsaveis]);

  // Buscar
  const search = useCallback((searchTerm) => {
    loadResponsaveis({ search: searchTerm, page: 1 });
  }, [loadResponsaveis]);

  // Limpar busca
  const clearSearch = useCallback(() => {
    loadResponsaveis({ search: '', page: 1 });
  }, [loadResponsaveis]);

  return {
    ...context,
    filters,
    loadResponsaveis,
    changePage,
    changeLimit,
    search,
    clearSearch,
  };
};

// Hook para formulário de responsável
export const useResponsavelForm = (initialData = null) => {
  const { createResponsavel, updateResponsavel } = useResponsaveis();
  const [formData, setFormData] = useState({
    nome: initialData?.nome || '',
    matricula: initialData?.matricula || '',
    permissao: initialData?.permissao || '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // Validar formulário
  const validateForm = useCallback(() => {
    const newErrors = {};

    if (!formData.nome.trim()) {
      newErrors.nome = 'Nome é obrigatório';
    } else if (formData.nome.trim().length < 2) {
      newErrors.nome = 'Nome deve ter pelo menos 2 caracteres';
    }

    if (!formData.matricula.trim()) {
      newErrors.matricula = 'Matrícula é obrigatória';
    } else if (!/^[A-Z0-9.-_]+$/i.test(formData.matricula.trim())) {
      newErrors.matricula = 'Matrícula deve conter apenas letras, números, pontos, traços e sublinhados';
    }

    if (formData.permissao !== '' && formData.permissao !== null) {
      const permissao = parseInt(formData.permissao);
      if (isNaN(permissao) || permissao < 0 || permissao > 10) {
        newErrors.permissao = 'Permissão deve ser um número entre 0 e 10';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  // Atualizar campo
  const updateField = useCallback((field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Limpar erro do campo
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  }, [errors]);

  // Submeter formulário
  const submitForm = useCallback(async () => {
    if (!validateForm()) {
      return false;
    }

    setLoading(true);

    try {
      const data = {
        nome: formData.nome.trim(),
        matricula: formData.matricula.trim().toUpperCase(),
        permissao: formData.permissao === '' ? null : parseInt(formData.permissao)
      };

      if (initialData?.id) {
        await updateResponsavel(initialData.id, data);
      } else {
        await createResponsavel(data);
      }

      return true;
    } catch (error) {
      console.error('Erro ao salvar responsável:', error);
      return false;
    } finally {
      setLoading(false);
    }
  }, [formData, initialData, validateForm, createResponsavel, updateResponsavel]);

  // Resetar formulário
  const resetForm = useCallback(() => {
    setFormData({
      nome: initialData?.nome || '',
      matricula: initialData?.matricula || '',
      permissao: initialData?.permissao || '',
    });
    setErrors({});
  }, [initialData]);

  return {
    formData,
    errors,
    loading,
    updateField,
    submitForm,
    validateForm,
    resetForm,
    isValid: Object.keys(errors).length === 0 && formData.nome.trim() && formData.matricula.trim(),
  };
};

// Hook para busca de responsáveis
export const useResponsavelSearch = () => {
  const { searchByMatricula, searchByNome, searchResults, searchLoading, clearSearch } = useResponsaveis();
  const [searchType, setSearchType] = useState('matricula'); // 'matricula' ou 'nome'
  const [searchTerm, setSearchTerm] = useState('');

  // Executar busca
  const executeSearch = useCallback(async (term = searchTerm, type = searchType) => {
    if (!term.trim()) return;

    try {
      if (type === 'matricula') {
        await searchByMatricula(term.trim());
      } else {
        await searchByNome(term.trim());
      }
    } catch (error) {
      console.error('Erro na busca:', error);
    }
  }, [searchTerm, searchType, searchByMatricula, searchByNome]);

  // Limpar busca
  const handleClearSearch = useCallback(() => {
    setSearchTerm('');
    clearSearch();
  }, [clearSearch]);

  return {
    searchType,
    setSearchType,
    searchTerm,
    setSearchTerm,
    searchResults,
    searchLoading,
    executeSearch,
    clearSearch: handleClearSearch,
    hasResults: searchResults.length > 0,
  };
};

// Hook para ações de responsável (visualizar, editar, excluir)
export const useResponsavelActions = () => {
  const { deleteResponsavel, selectResponsavel } = useResponsaveis();
  const [actionLoading, setActionLoading] = useState(false);

  // Excluir responsável
  const handleDelete = useCallback(async (id) => {
    setActionLoading(true);
    
    try {
      await deleteResponsavel(id);
      return true;
    } catch (error) {
      console.error('Erro ao excluir responsável:', error);
      return false;
    } finally {
      setActionLoading(false);
    }
  }, [deleteResponsavel]);

  // Selecionar responsável
  const handleSelect = useCallback((responsavel) => {
    selectResponsavel(responsavel);
  }, [selectResponsavel]);

  return {
    actionLoading,
    handleDelete,
    handleSelect,
  };
};