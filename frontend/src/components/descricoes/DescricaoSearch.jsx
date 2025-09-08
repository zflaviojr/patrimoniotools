import React from 'react';
import { useDescricaoSearch } from '../../hooks/useDescricoes.js';
import { Input, Button, Card } from '../common/index.js';

const DescricaoSearch = ({ onDescricaoSelect }) => {
  const {
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

  const handleDescricaoClick = (descricao) => {
    if (onDescricaoSelect) {
      onDescricaoSelect(descricao);
    }
  };

  return (
    <div className="space-y-6">
      {/* Formulário de busca */}
      <Card title="Buscar Descrição" className="w-full">
        <form onSubmit={handleSearch} className="space-y-4">
          {/* Campo de busca */}
          <div className="flex space-x-2">
            <div className="flex-1">
              <Input
                label="Buscar"
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Digite o termo para busca"
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
              {searchResults.length} descrição(ões) encontrada(s)
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {searchResults.map((descricao) => (
              <Card
                key={descricao.id}
                className="cursor-pointer hover:shadow-lg transition-shadow relative"
                onClick={() => handleDescricaoClick(descricao)}
              >
                {/* Ícone de seta no canto superior direito */}
                <div className="absolute top-3 right-3">
                  <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-8 w-8 bg-primary-100 rounded-full flex items-center justify-center">
                      <svg className="h-4 w-4 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h4 className="font-semibold text-gray-900 truncate">
                        {descricao.descricao}
                      </h4>
                    </div>
                  </div>
                  
                  <div className="text-sm text-gray-600">
                    <span className="font-medium">Código:</span> {descricao.codigo}
                  </div>
                  
                  {descricao.subcontasiafi && (
                    <div className="text-sm text-gray-600">
                      <span className="font-medium">Subconta SIAFI:</span> {descricao.subcontasiafi}
                    </div>
                  )}
                  
                  {descricao.vidautil !== null && descricao.vidautil !== undefined && (
                    <div className="text-sm text-gray-600">
                      <span className="font-medium">Vida Útil:</span> {descricao.vidautil} ano(s)
                    </div>
                  )}
                </div>
              </Card>
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
            Nenhuma descrição encontrada
          </h3>
          <p className="text-gray-600">
            Não encontramos nenhuma descrição com o termo "{searchTerm}"
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
                  <strong>Por Código:</strong> Digite o código exato da descrição
                </li>
                <li>
                  <strong>Por Termo:</strong> Digite parte da descrição
                </li>
                <li>
                  A busca não diferencia maiúsculas de minúsculas
                </li>
                <li>
                  Clique em uma descrição para visualizar detalhes
                </li>
              </ul>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default DescricaoSearch;