import { useState, useCallback, useMemo, useRef } from 'react';
import { useDescricoes } from '../context/DescricaoContext.jsx';
import { useToast } from '../context/ToastContext.jsx';

// Hook para gerenciar lista de descrições
export const useDescricoesList = () => {
  const context = useDescricoes();
  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
    search: '',
  });

  // Usar ref para armazenar os filtros e evitar loops infinitos
  const filtersRef = useRef(filters);
  // Usar ref para armazenar context.fetchDescricoes e evitar loops infinitos
  const fetchDescricoesRef = useRef(context.fetchDescricoes);
  
  // Atualizar refs quando os valores mudarem
  filtersRef.current = filters;
  fetchDescricoesRef.current = context.fetchDescricoes;

  // Carregar descrições com filtros
  const loadDescricoes = useCallback(async (newFilters = {}) => {
    const finalFilters = { ...filtersRef.current, ...newFilters };
    setFilters(finalFilters);
    
    try {
      await fetchDescricoesRef.current(finalFilters);
    } catch (error) {
      console.error('Erro ao carregar descrições:', error);
    }
  }, []);

  // Alterar página
  const changePage = useCallback((page) => {
    const newFilters = { ...filtersRef.current, page };
    setFilters(newFilters);
    fetchDescricoesRef.current(newFilters);
  }, []);

  // Alterar limite por página
  const changeLimit = useCallback((limit) => {
    const newFilters = { ...filtersRef.current, limit, page: 1 };
    setFilters(newFilters);
    fetchDescricoesRef.current(newFilters);
  }, []);

  // Buscar
  const search = useCallback((searchTerm) => {
    const newFilters = { ...filtersRef.current, search: searchTerm, page: 1 };
    setFilters(newFilters);
    fetchDescricoesRef.current(newFilters);
  }, []);

  // Limpar busca
  const clearSearch = useCallback(() => {
    const newFilters = { ...filtersRef.current, search: '', page: 1 };
    setFilters(newFilters);
    fetchDescricoesRef.current(newFilters);
  }, []);

  return {
    ...context,
    filters,
    loadDescricoes,
    changePage,
    changeLimit,
    search,
    clearSearch,
  };
};

// Hook para formulário de descrição
export const useDescricaoForm = (initialData = null) => {
  const { createDescricao, updateDescricao } = useDescricoes();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    descricao: initialData?.descricao || '',
    subcontasiafi: initialData?.subcontasiafi || '',
    vidautil: initialData?.vidautil || '',
    useradd: initialData?.useradd || '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  
  // Usar refs para armazenar valores e funções para evitar loops infinitos
  const formDataRef = useRef(formData);
  const initialDataRef = useRef(initialData);
  const createDescricaoRef = useRef(createDescricao);
  const updateDescricaoRef = useRef(updateDescricao);
  
  // Atualizar refs quando os valores mudarem
  formDataRef.current = formData;
  initialDataRef.current = initialData;
  createDescricaoRef.current = createDescricao;
  updateDescricaoRef.current = updateDescricao;

  // Validar formulário
  const validateForm = useCallback(() => {
    const newErrors = {};

    if (!formDataRef.current.descricao.trim()) {
      newErrors.descricao = 'Descrição é obrigatória';
    } else if (formDataRef.current.descricao.trim().length < 2) {
      newErrors.descricao = 'Descrição deve ter pelo menos 2 caracteres';
    }

    if (formDataRef.current.vidautil !== '' && formDataRef.current.vidautil !== null) {
      const vidautil = parseInt(formDataRef.current.vidautil);
      if (isNaN(vidautil) || vidautil < 0 || vidautil > 100) {
        newErrors.vidautil = 'Vida útil deve ser um número entre 0 e 100';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, []);

  // Atualizar campo
  const updateField = useCallback((field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Limpar erro do campo
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[field];
      return newErrors;
    });
  }, []);

  // Submeter formulário
  const submitForm = useCallback(async () => {
    if (!validateForm()) {
      toast.error('Por favor, preencha todos os campos obrigatórios corretamente.');
      return false;
    }

    setLoading(true);

    try {
      const data = {
        descricao: formDataRef.current.descricao.trim(),
        subcontasiafi: formDataRef.current.subcontasiafi.trim() || null,
        vidautil: formDataRef.current.vidautil === '' ? null : parseInt(formDataRef.current.vidautil),
        useradd: formDataRef.current.useradd.trim() || null
      };

      if (initialDataRef.current?.id) {
        await updateDescricaoRef.current(initialDataRef.current.id, data);
        toast.success('Descrição atualizada com sucesso!');
      } else {
        await createDescricaoRef.current(data);
        toast.success('Descrição criada com sucesso!');
      }

      return true;
    } catch (error) {
      console.error('Erro completo ao salvar descrição:', {
        error,
        response: error.response,
        data: error.response?.data,
        message: error.response?.data?.message,
        status: error.response?.status
      });
      
      // Extrair mensagem de erro mais específica
      let errorMessage = 'Erro interno do servidor';
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      console.log('Mensagem de erro que será exibida:', errorMessage);
      toast.error(`${errorMessage}`);
      return false;
    } finally {
      setLoading(false);
    }
  }, [validateForm, toast]);

  // Submeter formulário sem validação (para usar após confirmação)
  const submitFormWithoutValidation = useCallback(async () => {
    setLoading(true);

    try {
      const data = {
        descricao: formDataRef.current.descricao.trim(),
        subcontasiafi: formDataRef.current.subcontasiafi.trim() || null,
        vidautil: formDataRef.current.vidautil === '' ? null : parseInt(formDataRef.current.vidautil),
        useradd: formDataRef.current.useradd.trim() || null
      };

      console.log('Enviando dados para o backend:', data);

      if (initialDataRef.current?.id) {
        await updateDescricaoRef.current(initialDataRef.current.id, data);
        toast.success('Descrição atualizada com sucesso!');
      } else {
        await createDescricaoRef.current(data);
        toast.success('Descrição criada com sucesso!');
      }

      return true;
    } catch (error) {
      console.error('Erro completo ao salvar descrição:', {
        error,
        response: error.response,
        data: error.response?.data,
        message: error.response?.data?.message,
        status: error.response?.status
      });
      
      // Extrair mensagem de erro mais específica
      let errorMessage = 'Erro interno do servidor';
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      console.log('Mensagem de erro que será exibida:', errorMessage);
      toast.error(`${errorMessage}`);
      return false;
    } finally {
      setLoading(false);
    }
  }, [toast]);

  // Resetar formulário
  const resetForm = useCallback(() => {
    setFormData({
      descricao: initialDataRef.current?.descricao || '',
      subcontasiafi: initialDataRef.current?.subcontasiafi || '',
      vidautil: initialDataRef.current?.vidautil || '',
      useradd: initialDataRef.current?.useradd || '',
    });
    setErrors({});
  }, []);

  return {
    formData,
    errors,
    loading,
    updateField,
    submitForm,
    submitFormWithoutValidation,
    validateForm,
    resetForm,
    isValid: Object.keys(errors).length === 0 && formData.descricao.trim(),
  };
};

// Hook para busca de descrições
export const useDescricaoSearch = () => {
  const { searchByCodigo, searchByTermo, searchResults, searchLoading, clearSearch } = useDescricoes();
  const [searchType, setSearchType] = useState('termo'); // 'codigo' ou 'termo'
  const [searchTerm, setSearchTerm] = useState('');
  
  // Usar refs para armazenar valores e funções para evitar loops infinitos
  const searchTermRef = useRef(searchTerm);
  const searchTypeRef = useRef(searchType);
  const searchByCodigoRef = useRef(searchByCodigo);
  const searchByTermoRef = useRef(searchByTermo);
  
  // Atualizar refs quando os valores mudarem
  searchTermRef.current = searchTerm;
  searchTypeRef.current = searchType;
  searchByCodigoRef.current = searchByCodigo;
  searchByTermoRef.current = searchByTermo;

  // Executar busca
  const executeSearch = useCallback(async (term = searchTermRef.current, type = searchTypeRef.current) => {
    if (!term.trim()) return;

    try {
      if (type === 'codigo') {
        await searchByCodigoRef.current(term.trim());
      } else {
        await searchByTermoRef.current(term.trim());
      }
    } catch (error) {
      console.error('Erro na busca:', error);
    }
  }, []);

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

// Hook para ações de descrição (visualizar, editar, excluir)
export const useDescricaoActions = () => {
  const { deleteDescricao, selectDescricao } = useDescricoes();
  const [actionLoading, setActionLoading] = useState(false);
  
  // Usar refs para armazenar funções e evitar loops infinitos
  const deleteDescricaoRef = useRef(deleteDescricao);
  const selectDescricaoRef = useRef(selectDescricao);
  
  // Atualizar refs quando os valores mudarem
  deleteDescricaoRef.current = deleteDescricao;
  selectDescricaoRef.current = selectDescricao;

  // Excluir descrição
  const handleDelete = useCallback(async (id) => {
    setActionLoading(true);
    
    try {
      await deleteDescricaoRef.current(id);
      return true;
    } catch (error) {
      console.error('Erro ao excluir descrição:', error);
      return false;
    } finally {
      setActionLoading(false);
    }
  }, []);

  // Selecionar descrição
  const handleSelect = useCallback((descricao) => {
    selectDescricaoRef.current(descricao);
  }, []);

  return {
    actionLoading,
    handleDelete,
    handleSelect,
  };
};
