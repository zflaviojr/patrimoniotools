import React from 'react';
import { Button } from '../common/index.js';

const ResponsavelTableList = ({ 
  responsaveis = [], 
  onEdit, 
  onDelete, 
  onView,
  onCreate,
  loading = false 
}) => {
  if (loading) {
    return (
      <div className="bg-white shadow rounded-lg overflow-hidden">
        {/* Header */}
        <div className="bg-gray-50 px-6 py-3 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-900">
              Carregando responsáveis...
            </h3>
          </div>
        </div>
        
        {/* Loading rows */}
        {[...Array(5)].map((_, index) => (
          <div key={index} className="border-b border-gray-200 px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded animate-pulse mb-2"></div>
                <div className="h-3 bg-gray-100 rounded animate-pulse w-1/3"></div>
              </div>
              <div className="flex space-x-2">
                <div className="h-8 w-8 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-8 w-8 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-8 w-8 bg-gray-200 rounded animate-pulse"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (responsaveis.length === 0) {
    return (
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="text-center py-12">
          <svg className="h-12 w-12 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-3.5a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Nenhum responsável encontrado
          </h3>
          <p className="text-gray-500 mb-4">
            Comece criando o primeiro responsável
          </p>
          {onCreate && (
            <Button 
              size="small" 
              onClick={onCreate}
              leftIcon={
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              }
            >
              Novo Responsável
            </Button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      {/* Header - Oculto em mobile, visível em desktop */}
      <div className="hidden md:block bg-gray-50 px-6 py-3 border-b border-gray-200">
        <div className="grid grid-cols-12 gap-4 items-center text-xs font-medium text-gray-500 uppercase tracking-wider">
          <div className="col-span-4">Nome</div>
          <div className="col-span-3">Matrícula</div>
          <div className="col-span-2">Permissão</div>
          <div className="col-span-3 text-right">Ações</div>
        </div>
      </div>

      {/* Lista de responsáveis */}
      <div className="divide-y divide-gray-200">
        {responsaveis.map((responsavel) => (
          <div key={responsavel.id} className="px-6 py-4 hover:bg-gray-50 transition-colors">
            {/* Layout Mobile */}
            <div className="md:hidden">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0 pr-4">
                  <h4 className="text-base font-semibold text-gray-900 truncate leading-tight">
                    {responsavel.nome}
                  </h4>
                  <div className="mt-2 space-y-1">
                    <div className="flex items-center text-sm text-gray-600">
                      <span className="font-medium text-gray-700">Matrícula:</span>
                      <span className="ml-2 bg-gray-100 px-2 py-1 rounded text-xs font-mono">{responsavel.matricula}</span>
                    </div>
                    {responsavel.permissao !== null && responsavel.permissao !== undefined && (
                      <div className="flex items-center text-sm text-gray-600">
                        <span className="font-medium text-gray-700">Permissão:</span>
                        <span className={`ml-2 px-2 py-1 rounded text-xs font-medium ${
                          responsavel.permissao >= 8 ? 'bg-green-100 text-green-800' :
                          responsavel.permissao >= 5 ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          Nível {responsavel.permissao}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Ações Mobile */}
                <div className="flex items-center space-x-1 ml-4 flex-shrink-0">
                  {onView && (
                    <button
                      onClick={() => onView(responsavel)}
                      className="p-2 text-gray-400 hover:text-primary-600 rounded-lg transition-colors"
                      title="Visualizar"
                    >
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </button>
                  )}
                  
                  {onEdit && (
                    <button
                      onClick={() => onEdit(responsavel)}
                      className="p-2 text-gray-400 hover:text-blue-600 rounded-lg transition-colors"
                      title="Editar"
                    >
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                  )}
                  
                  {onDelete && (
                    <button
                      onClick={() => onDelete(responsavel)}
                      className="p-2 text-gray-400 hover:text-red-600 rounded-lg transition-colors"
                      title="Excluir"
                    >
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Layout Desktop */}
            <div className="hidden md:block">
              <div className="grid grid-cols-12 gap-4 items-center">
                {/* Nome */}
                <div className="col-span-4">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-8 w-8 bg-primary-100 rounded-full flex items-center justify-center">
                      <svg className="h-4 w-4 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-semibold text-gray-900 truncate">
                        {responsavel.nome}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Matrícula */}
                <div className="col-span-3">
                  <div className="flex items-center">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                      {responsavel.matricula}
                    </span>
                  </div>
                </div>

                {/* Permissão */}
                <div className="col-span-2">
                  {responsavel.permissao !== null && responsavel.permissao !== undefined ? (
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      responsavel.permissao >= 8 ? 'bg-green-100 text-green-800' :
                      responsavel.permissao >= 5 ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      Nível {responsavel.permissao}
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                      Não definido
                    </span>
                  )}
                </div>

                {/* Ações Desktop */}
                <div className="col-span-3 text-right">
                  <div className="flex items-center justify-end space-x-2">
                    {onView && (
                      <Button
                        variant="secondary"
                        size="small"
                        onClick={() => onView(responsavel)}
                        title="Visualizar"
                      >
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      </Button>
                    )}
                    
                    {onEdit && (
                      <Button
                        variant="secondary"
                        size="small"
                        onClick={() => onEdit(responsavel)}
                        title="Editar"
                      >
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </Button>
                    )}
                    
                    {onDelete && (
                      <Button
                        variant="danger"
                        size="small"
                        onClick={() => onDelete(responsavel)}
                        title="Excluir"
                      >
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ResponsavelTableList;