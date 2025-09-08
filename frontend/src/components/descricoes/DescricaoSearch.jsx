import React from 'react';
import { useDescricaoSearch } from '../../hooks/useDescricoes.js';
import { Input, Button, Card } from '../common/index.js';

const DescricaoSearch = () => {
  const {
    searchType,
    setSearchType,
    searchTerm,
    setSearchTerm,
    searchResults,
    searchLoading,
    executeSearch,
    clearSearch,
    hasResults,
  } = useDescricaoSearch();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      executeSearch();
    }
  };

  const handleClear = () => {
    setSearchTerm('');
    clearSearch();
  };

  return (
    <Card className="p-4">
      <form onSubmit={handleSearch} className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <Input
              label="Buscar"
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={
                searchType === 'codigo' 
                  ? 'Digite o código da descrição' 
                  : 'Digite o termo para busca'
              }
              disabled={searchLoading}
              leftIcon={
                <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              }
            />
          </div>
          
          <div className="flex items-end space-x-2">
            <Button type="submit" loading={searchLoading} className="flex items-center gap-2">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              Buscar
            </Button>
            
            {(searchTerm || hasResults) && (
              <Button
                type="button"
                variant="secondary"
                onClick={handleClear}
                className="flex items-center gap-2"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                Limpar
              </Button>
            )}
          </div>
        </div>
        
        {hasResults && (
          <div className="mt-4 p-4 bg-blue-50 rounded-lg">
            <h3 className="text-sm font-medium text-blue-800">
              Resultados da busca ({searchResults.length} encontrado{searchResults.length !== 1 ? 's' : ''})
            </h3>
            <ul className="mt-2 space-y-1">
              {searchResults.map((result) => (
                <li key={result.id} className="text-sm text-blue-700">
                  <span className="font-medium">{result.codigo}</span> - {result.descricao}
                </li>
              ))}
            </ul>
          </div>
        )}
      </form>
    </Card>
  );
};

export default DescricaoSearch;