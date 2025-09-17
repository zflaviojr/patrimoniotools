import React from 'react';

const LoginAttemptCounter = ({ remainingAttempts, maxAttempts = 5 }) => {
  // Só mostrar o contador quando houver tentativas restantes e não estiver bloqueado
  if (remainingAttempts === null || remainingAttempts <= 0) {
    return null;
  }
  
  const attemptsUsed = maxAttempts - remainingAttempts;
  
  return (
    <div className="mt-4 p-3 bg-yellow-50 rounded-md">
      <div className="flex items-center">
        <svg className="h-5 w-5 text-yellow-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <div>
          <p className="text-sm font-medium text-yellow-800">
            Tentativas restantes: {remainingAttempts} de {maxAttempts}
          </p>
          <div className="mt-1 w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-yellow-600 h-2 rounded-full" 
              style={{ width: `${(attemptsUsed / maxAttempts) * 100}%` }}
            ></div>
          </div>
          {remainingAttempts === 1 && (
            <p className="mt-1 text-xs text-yellow-700">
              Cuidado! Após mais uma tentativa falha, sua conta será bloqueada temporariamente.
            </p>
          )}
          {remainingAttempts > 1 && remainingAttempts < maxAttempts && (
            <p className="mt-1 text-xs text-yellow-700">
              Cuidado! Após {remainingAttempts} tentativas falhas, sua conta será bloqueada temporariamente.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginAttemptCounter;