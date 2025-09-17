import React from 'react';

const PasswordPolicyIndicator = ({ password }) => {
  // Verificar requisitos da senha
  const hasMinLength = password && password.length >= 8;
  const hasUpperCase = password && /[A-Z]/.test(password);
  const hasLowerCase = password && /[a-z]/.test(password);
  const hasNumber = password && /[0-9]/.test(password);
  const hasSpecialChar = password && /[!@#$%^&*]/.test(password);
  
  const requirements = [
    { id: 'length', text: 'Mínimo de 8 caracteres', met: hasMinLength },
    { id: 'uppercase', text: 'Pelo menos uma letra maiúscula', met: hasUpperCase },
    { id: 'lowercase', text: 'Pelo menos uma letra minúscula', met: hasLowerCase },
    { id: 'number', text: 'Pelo menos um número', met: hasNumber },
    { id: 'special', text: 'Pelo menos um caractere especial (!@#$%^&*)', met: hasSpecialChar }
  ];
  
  const allMet = requirements.every(req => req.met);
  
  return (
    <div className="mt-4">
      <h4 className="text-sm font-medium text-gray-700 mb-2">Requisitos da senha:</h4>
      <ul className="space-y-1">
        {requirements.map((req) => (
          <li key={req.id} className="flex items-center">
            {req.met ? (
              <svg className="h-4 w-4 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg className="h-4 w-4 text-gray-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            )}
            <span className={`text-sm ${req.met ? 'text-green-600' : 'text-gray-500'}`}>
              {req.text}
            </span>
          </li>
        ))}
      </ul>
      {password && (
        <div className={`mt-2 text-sm ${allMet ? 'text-green-600' : 'text-red-600'}`}>
          {allMet ? 'Senha atende a todos os requisitos' : 'Senha não atende a todos os requisitos'}
        </div>
      )}
    </div>
  );
};

export default PasswordPolicyIndicator;