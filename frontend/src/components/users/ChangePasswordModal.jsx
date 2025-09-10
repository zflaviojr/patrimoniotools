import React, { useState } from 'react';
import { Modal } from '../common';
import { Button } from '../common';
import { useToast } from '../../context/ToastContext';
import { authService } from '../../services/authService';

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

const ChangePasswordModal = ({ isOpen, onClose, onSuccess }) => {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: ''
  });
  const [errors, setErrors] = useState({});

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

    // Validar senha atual
    if (!formData.currentPassword) {
      newErrors.currentPassword = 'Senha atual é obrigatória';
    }

    // Validar nova senha
    if (!formData.newPassword) {
      newErrors.newPassword = 'Nova senha é obrigatória';
    } else if (formData.newPassword.length < 6) {
      newErrors.newPassword = 'Nova senha deve ter pelo menos 6 caracteres';
    }

    // Validar confirmação de senha
    if (!formData.confirmNewPassword) {
      newErrors.confirmNewPassword = 'Confirmação de senha é obrigatória';
    } else if (formData.newPassword !== formData.confirmNewPassword) {
      newErrors.confirmNewPassword = 'As senhas não coincidem';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      // Corrigir os nomes dos campos para corresponder ao backend
      const response = await authService.changePassword({
        oldPassword: formData.currentPassword,
        newPassword: formData.newPassword
      });

      if (response.success) {
        showToast(response.message || 'Senha alterada com sucesso!', 'success');
        // Limpar formulário
        setFormData({
          currentPassword: '',
          newPassword: '',
          confirmNewPassword: ''
        });
        setErrors({});
        // Fechar modal e chamar callback de sucesso
        if (onSuccess) onSuccess();
        onClose();
      } else {
        showToast(response.message || 'Erro ao alterar senha', 'error');
      }
    } catch (error) {
      console.error('Erro ao alterar senha:', error);
      showToast(
        error.response?.data?.message || 
        error.message || 
        'Erro ao alterar senha. Verifique sua senha atual e tente novamente.',
        'error'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    // Limpar formulário ao fechar
    setFormData({
      currentPassword: '',
      newPassword: '',
      confirmNewPassword: ''
    });
    setErrors({});
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Alterar Senha"
      size="small"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-4">
          <PasswordInput
            label="Senha Atual"
            value={formData.currentPassword}
            onChange={(e) => handleInputChange('currentPassword', e.target.value)}
            error={errors.currentPassword}
            disabled={loading}
            placeholder="Digite sua senha atual"
            required
          />

          <PasswordInput
            label="Nova Senha"
            value={formData.newPassword}
            onChange={(e) => handleInputChange('newPassword', e.target.value)}
            error={errors.newPassword}
            disabled={loading}
            placeholder="Digite sua nova senha"
            required
          />

          <PasswordInput
            label="Confirmar Nova Senha"
            value={formData.confirmNewPassword}
            onChange={(e) => handleInputChange('confirmNewPassword', e.target.value)}
            error={errors.confirmNewPassword}
            disabled={loading}
            placeholder="Confirme sua nova senha"
            required
          />
        </div>

        <div className="flex justify-end space-x-3 pt-4">
          <Button
            type="button"
            variant="secondary"
            onClick={handleClose}
            disabled={loading}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            loading={loading}
            disabled={loading}
          >
            Alterar Senha
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default ChangePasswordModal;