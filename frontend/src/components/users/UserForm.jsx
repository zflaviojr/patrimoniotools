import React, { useState, useEffect } from 'react';
import { Button, Input, PhoneInput } from '../common';

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

        <Input
          label="Senha"
          type="password"
          value={formData.password}
          onChange={(e) => handleInputChange('password', e.target.value)}
          error={errors.password}
          disabled={loading}
          placeholder={user ? "Deixe em branco para manter a senha atual" : "Digite a senha"}
          required={!user}
        />

        <Input
          label="Confirmar Senha"
          type="password"
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