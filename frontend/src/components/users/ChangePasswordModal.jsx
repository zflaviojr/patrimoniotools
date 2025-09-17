import React, { useState } from 'react';
import Modal from '../common/Modal.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { authService } from '../../services/authService.js';
import PasswordPolicyIndicator from '../auth/PasswordPolicyIndicator.jsx';

// Componente personalizado para input de senha com ícone de visualização
const PasswordInput = ({ 
  label, 
  id,
  name,
  value, 
  onChange, 
  error, 
  disabled,
  required
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <div className="relative mt-1">
        <input
          type={showPassword ? "text" : "password"}
          id={id}
          name={name}
          value={value}
          onChange={onChange}
          disabled={disabled}
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

const ChangePasswordModal = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmNewPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState(''); // success or error

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Limpar erros específicos do campo
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
    
    // Limpar mensagens gerais
    if (message) {
      setMessage('');
      setMessageType('');
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.oldPassword) {
      newErrors.oldPassword = 'Senha atual é obrigatória';
    }
    
    if (!formData.newPassword) {
      newErrors.newPassword = 'Nova senha é obrigatória';
    }
    
    if (!formData.confirmNewPassword) {
      newErrors.confirmNewPassword = 'Confirmação de senha é obrigatória';
    }
    
    if (formData.newPassword && formData.confirmNewPassword && 
        formData.newPassword !== formData.confirmNewPassword) {
      newErrors.confirmNewPassword = 'As senhas não coincidem';
    }
    
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }
    
    setIsSubmitting(true);
    setMessage('');
    setMessageType('');
    
    try {
      await authService.changePassword({
        oldPassword: formData.oldPassword,
        newPassword: formData.newPassword
      });
      
      setMessage('Senha alterada com sucesso!');
      setMessageType('success');
      
      // Limpar formulário
      setFormData({
        oldPassword: '',
        newPassword: '',
        confirmNewPassword: ''
      });
      
      // Fechar modal após 2 segundos
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (error) {
      setMessage(error.message || 'Erro ao alterar senha');
      setMessageType('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const closeModal = () => {
    // Limpar estado ao fechar
    setFormData({
      oldPassword: '',
      newPassword: '',
      confirmNewPassword: ''
    });
    setErrors({});
    setMessage('');
    setMessageType('');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={closeModal} title="Alterar Senha">
      <form onSubmit={handleSubmit} className="space-y-4">
        <PasswordInput
          label="Senha Atual"
          id="oldPassword"
          name="oldPassword"
          value={formData.oldPassword}
          onChange={handleChange}
          error={errors.oldPassword}
          disabled={isSubmitting}
          required
        />
        
        <PasswordInput
          label="Nova Senha"
          id="newPassword"
          name="newPassword"
          value={formData.newPassword}
          onChange={handleChange}
          error={errors.newPassword}
          disabled={isSubmitting}
          required
        />
        
        {/* Indicador de política de senhas */}
        <PasswordPolicyIndicator password={formData.newPassword} />
        
        <PasswordInput
          label="Confirmar Nova Senha"
          id="confirmNewPassword"
          name="confirmNewPassword"
          value={formData.confirmNewPassword}
          onChange={handleChange}
          error={errors.confirmNewPassword}
          disabled={isSubmitting}
          required
        />
        
        {message && (
          <div className={`rounded-md p-4 ${messageType === 'success' ? 'bg-green-50' : 'bg-red-50'}`}>
            <div className="flex">
              <div className="flex-shrink-0">
                {messageType === 'success' ? (
                  <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
              <div className="ml-3">
                <p className={`text-sm ${messageType === 'success' ? 'text-green-800' : 'text-red-800'}`}>
                  {message}
                </p>
              </div>
            </div>
          </div>
        )}
        
        <div className="flex justify-end space-x-3 mt-6">
          <button
            type="button"
            onClick={closeModal}
            className="btn-secondary"
            disabled={isSubmitting}
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="btn-primary"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Alterando...
              </div>
            ) : (
              'Alterar Senha'
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default ChangePasswordModal;