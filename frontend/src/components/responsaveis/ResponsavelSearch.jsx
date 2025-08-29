import React from 'react';
import { useResponsavelSearch } from '../../hooks/useResponsaveis.js';
import { Input, Button, Card, Select, ResponsavelCard } from '../common/index.js';

const ResponsavelSearch = ({ onResponsavelSelect }) => {
  const {
    searchType,
    setSearchType,
    searchTerm,
    setSearchTerm,
    searchResults,
    searchLoading,
    executeSearch,
    clearSearch,
    hasResults
  } = useResponsavelSearch();

  // Lidar com submit da busca
  const handleSubmit = (e) => {
    e.preventDefault();
    executeSearch();
  };

  // Lidar com mudança do tipo de busca
  const handleSearchTypeChange = (e) => {
    setSearchType(e.target.value);
    setSearchTerm('');
    clearSearch();
  };

  return (
    <div className="space-y-6">
      {/* Formulário de busca */}
      <Card title="Buscar Responsável" className="w-full max-w-2xl mx-auto">
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Tipo de busca */}
          <Select
            label="Tipo de Busca"
            value={searchType}
            onChange={handleSearchTypeChange}
            disabled={searchLoading}
          >
            <option value="matricula">Por Matrícula</option>
            <option value="nome">Por Nome</option>
          </Select>

          {/* Campo de busca */}
          <div className="flex space-x-2">
            <div className="flex-1">
              <Input
                label={searchType === 'matricula' ? 'Matrícula' : 'Nome'}
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={
                  searchType === 'matricula' 
                    ? 'Digite a matrícula' 
                    : 'Digite o nome ou parte do nome'
                }
                disabled={searchLoading}
                leftIcon={
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                }
              />
            </div>
          </div>

          {/* Botões */}
          <div className="flex justify-between">
            <Button
              type="button"
              variant="secondary"
              onClick={clearSearch}
              disabled={searchLoading || (!hasResults && !searchTerm)}
            >
              Limpar
            </Button>
            
            <div className="space-x-2">
              <Button
                type="submit"
                loading={searchLoading}
                disabled={!searchTerm.trim()}
              >
                <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                Buscar
              </Button>
            </div>
          </div>
        </form>
      </Card>

      {/* Resultados da busca */}
      {hasResults && (
        <div className="space-y-4">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-900">
              Resultados da Busca
            </h3>
            <p className="text-sm text-gray-600">
              {searchResults.length} responsável(eis) encontrado(s)
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {searchResults.map((responsavel) => (
              <ResponsavelCard
                key={responsavel.id}
                responsavel={responsavel}
                onView={() => onResponsavelSelect && onResponsavelSelect(responsavel)}
                className="cursor-pointer hover:shadow-lg transition-shadow"
              />
            ))}
          </div>
        </div>
      )}

      {/* Estado vazio */}
      {searchTerm && !searchLoading && !hasResults && (
        <Card className="text-center py-8">
          <svg className="h-12 w-12 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Nenhum responsável encontrado
          </h3>
          <p className="text-gray-600">
            {searchType === 'matricula' 
              ? `Não encontramos nenhum responsável com a matrícula "${searchTerm}"`
              : `Não encontramos nenhum responsável com o nome "${searchTerm}"`
            }
          </p>
        </Card>
      )}

      {/* Dicas de busca */}
      <Card className="bg-blue-50 border-blue-200">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-blue-800">
              Dicas de busca
            </h3>
            <div className="mt-2 text-sm text-blue-700">
              <ul className="list-disc pl-5 space-y-1">
                <li>
                  <strong>Por Matrícula:</strong> Digite a matrícula exata do responsável
                </li>
                <li>
                  <strong>Por Nome:</strong> Digite o nome completo ou parte do nome
                </li>
                <li>
                  A busca por nome não diferencia maiúsculas de minúsculas
                </li>
                <li>
                  Clique em um responsável para visualizar detalhes
                </li>
              </ul>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ResponsavelSearch;