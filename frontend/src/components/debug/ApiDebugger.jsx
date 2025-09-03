import React, { useState } from 'react';
import { testBackendConnection } from '../../utils/debugTools';
import { Button } from '../common';

/**
 * Componente para debug da API
 */
const ApiDebugger = () => {
  const [testResult, setTestResult] = useState(null);
  const [loading, setLoading] = useState(false);
  
  const runTest = async () => {
    setLoading(true);
    try {
      const result = await testBackendConnection();
      setTestResult(result);
    } catch (error) {
      setTestResult({
        success: false,
        message: `Erro inesperado: ${error.message}`,
        error
      });
    } finally {
      setLoading(false);
    }
  };
  
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  };
  
  return (
    <div className="fixed bottom-0 right-0 m-4 p-4 bg-white shadow-lg rounded-lg z-50 w-96 border-2 border-blue-500">
      <h3 className="text-lg font-bold mb-2">Debug da API</h3>
      
      <div className="flex gap-2 mb-3">
        <Button 
          onClick={runTest} 
          disabled={loading}
          className="bg-blue-500 hover:bg-blue-600 text-white"
          size="sm"
        >
          {loading ? 'Testando...' : 'Testar API'}
        </Button>
        
        <Button
          onClick={logout}
          className="bg-red-500 hover:bg-red-600 text-white"
          size="sm"
        >
          Forçar Logout
        </Button>
      </div>
      
      {testResult && (
        <div className={`p-3 rounded ${testResult.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
          <p className={`font-bold ${testResult.success ? 'text-green-700' : 'text-red-700'}`}>
            {testResult.success ? '✅ Sucesso' : '❌ Erro'}
          </p>
          <p className="text-sm mt-1">{testResult.message}</p>
          
          {testResult.success && testResult.data?.data && (
            <div className="mt-2 text-xs">
              <p>Usuários encontrados: {testResult.data.data.length}</p>
              <div className="max-h-32 overflow-y-auto mt-1 p-2 bg-white rounded">
                {testResult.data.data.map((user, index) => (
                  <div key={user.id} className="mb-1 pb-1 border-b border-gray-100">
                    <span className="font-medium">{user.username}</span>
                    {user.email && <span className="ml-1 text-gray-500">({user.email})</span>}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
      
      <div className="mt-2 text-xs text-gray-500">
        <p>Token: {localStorage.getItem('token') ? '✅ Presente' : '❌ Ausente'}</p>
        <p>Usuário: {localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).username : 'Não logado'}</p>
      </div>
    </div>
  );
};

export default ApiDebugger;