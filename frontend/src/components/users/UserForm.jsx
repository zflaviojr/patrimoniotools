import React, { useState, useEffect } from 'react';
import { Button, Input, PhoneInput } from '../common';

// Componente personalizado para input de senha com ícone de visualização
const PasswordInput = ({ 
  label, 
  value, 
  onChange, 
  error, 
  disabled, 
  placeholder, 
  required 
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <div className="relative">
        <input
          type={showPassword ? "text" : "password"}
          value={value}
          onChange={onChange}
          disabled={disabled}
          placeholder={placeholder}
          required={required}
          className={`
            w-full px-3 py-2 border rounded-md shadow-sm
            focus:outline-none focus:ring-ufcg-blue focus:border-ufcg-blue
            ${error ? 'border-red-300' : 'border-gray-300'}
            ${disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}
          `}
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute inset-y-0 right-0 pr-3 flex items-center"
          disabled={disabled}
        >
          <svg 
            className={`h-5 w-5 ${showPassword ? 'text-ufcg-blue' : 'text-gray-400'}`} 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            {showPassword ? (
              <>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </>
            ) : (
              <>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
              </>
            )}
          </svg>
        </button>
      </div>
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};

const UserForm = ({ onSubmit, user, loading, onCancel }) => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    telefone: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});

  // Preencher formulário quando um usuário for fornecido para edição
  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username || '',
        email: user.email || '',
        telefone: user.telefone || '',
        password: '',
        confirmPassword: ''
      });
    }
  }, [user]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Limpar erro do campo quando o usuário começar a digitar
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Validação do username
    if (!formData.username.trim()) {
      newErrors.username = 'Username é obrigatório';
    } else if (formData.username.length < 3) {
      newErrors.username = 'Username deve ter pelo menos 3 caracteres';
    } else if (formData.username.length > 50) {
      newErrors.username = 'Username deve ter no máximo 50 caracteres';
    } else if (!/^[a-zA-Z0-9_.-]+$/.test(formData.username)) {
      newErrors.username = 'Username deve conter apenas letras, números, underscore, ponto e hífen';
    }

    // Validação do email (opcional, mas se preenchido deve ser válido)
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email deve ter formato válido';
    }

    // Validação do telefone (opcional, mas se preenchido deve ser válido)
    if (formData.telefone && !/^\(\d{2}\)\s\d{4,5}-\d{4}$/.test(formData.telefone)) {
      newErrors.telefone = 'Telefone deve estar no formato (XX) XXXXX-XXXX ou (XX) XXXX-XXXX';
    }

    // Validação de senha (obrigatória na criação, opcional na edição)
    if (!user) {
      // Criando novo usuário
      if (!formData.password) {
        newErrors.password = 'Senha é obrigatória';
      } else if (formData.password.length < 6) {
        newErrors.password = 'Senha deve ter pelo menos 6 caracteres';
      }

      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'As senhas não coincidem';
      }
    } else {
      // Editando usuário - senha é opcional
      if (formData.password && formData.password.length < 6) {
        newErrors.password = 'Senha deve ter pelo menos 6 caracteres';
      }

      if (formData.password && formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'As senhas não coincidem';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      const userData = {
        username: formData.username.trim(),
        email: formData.email.trim() || null,
        telefone: formData.telefone || null
      };

      // Adicionar senha apenas se foi preenchida
      if (formData.password) {
        userData.password = formData.password;
      }

      // Seguir o mesmo padrão do handleSave do UserProfile.jsx
      try {
        await onSubmit(userData);
      } catch (error) {
        console.error('Erro ao submeter formulário:', error);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          {user ? 'Editar Usuário' : 'Novo Usuário'}
        </h3>
      </div>

      <div className="space-y-4">
        <Input
          label="Username"
          type="text"
          value={formData.username}
          onChange={(e) => handleInputChange('username', e.target.value)}
          error={errors.username}
          disabled={loading || !!user} // Username não pode ser alterado após criação
          placeholder="Digite o username"
          required
        />

        <Input
          label="Email"
          type="email"
          value={formData.email}
          onChange={(e) => handleInputChange('email', e.target.value)}
          error={errors.email}
          disabled={loading}
          placeholder="Digite o email (opcional)"
        />

        <PhoneInput
          label="Telefone"
          value={formData.telefone}
          onChange={(value) => handleInputChange('telefone', value)}
          error={errors.telefone}
          disabled={loading}
          placeholder="Digite o telefone (opcional)"
        />

        <PasswordInput
          label="Senha"
          value={formData.password}
          onChange={(e) => handleInputChange('password', e.target.value)}
          error={errors.password}
          disabled={loading}
          placeholder={user ? "Deixe em branco para manter a senha atual" : "Digite a senha"}
          required={!user}
        />

        <PasswordInput
          label="Confirmar Senha"
          value={formData.confirmPassword}
          onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
          error={errors.confirmPassword}
          disabled={loading}
          placeholder={user ? "Confirme a nova senha" : "Confirme a senha"}
          required={!user || !!formData.password}
        />
      </div>

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
          disabled={loading}
        >
          {user ? 'Atualizar' : 'Criar'} Usuário
        </Button>
      </div>
    </form>
  );
};

export default UserForm;