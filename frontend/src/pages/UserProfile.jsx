import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Card, PhoneInput } from '../components/common';
import { Button } from '../components/common';
import { Input } from '../components/common';
import { useToast } from '../context/ToastContext';
import { authService } from '../services/authService';

const UserProfile = () => {
  const { user, updateUser } = useAuth();
  const { showToast } = useToast();
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [profileData, setProfileData] = useState({
    email: '',
    telefone: ''
  });
  const [errors, setErrors] = useState({});
  
  // Inicializar dados do perfil com dados do usuário
  useEffect(() => {
    if (user) {
      setProfileData({
        email: user.email || '',
        telefone: user.telefone || ''
      });
    }
  }, [user]);

  const handleInputChange = (field, value) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Limpar erro quando usuário começar a digitar
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: null
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Validar email
    if (profileData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profileData.email)) {
      newErrors.email = 'Email deve ter formato válido';
    }
    
    // Validar telefone
    if (profileData.telefone && !/^\(\d{2}\)\s\d{4,5}-\d{4}$/.test(profileData.telefone)) {
      newErrors.telefone = 'Telefone deve estar no formato (XX) XXXXX-XXXX';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      showToast('Por favor, corrija os erros do formulário', 'error');
      return;
    }
    
    setLoading(true);
    try {
      const response = await authService.updateProfile(profileData);
      
      if (response.success) {
        // Atualizar dados do usuário no contexto
        updateUser(response.data.user);
        showToast(response.message || 'Perfil atualizado com sucesso!', 'success');
        setEditing(false);
      } else {
        showToast(response.message || 'Erro ao atualizar perfil', 'error');
      }
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
      showToast(error.response?.data?.message || error.message || 'Erro ao atualizar perfil', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    // Resetar para valores originais
    setProfileData({
      email: user?.email || '',
      telefone: user?.telefone || ''
    });
    setErrors({});
    setEditing(false);
  };

  const recentActivities = [
    { id: 1, action: 'Login realizado', date: '01/01/2025', time: '14:30' },
    { id: 2, action: 'Responsável cadastrado', date: '31/12/2024', time: '16:45' },
    { id: 3, action: 'Dados alterados', date: '30/12/2024', time: '09:15' },
    { id: 4, action: 'Relatório gerado', date: '29/12/2024', time: '11:20' },
  ];

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Page Header */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 font-institutional">
              Meu Perfil
            </h1>
            <p className="text-gray-600 mt-2">
              Gerencie suas informações pessoais e configurações da conta
            </p>
          </div>
          <div className="flex space-x-3">
            {!editing ? (
              <Button
                onClick={() => setEditing(true)}
                className="bg-ufcg-blue hover:bg-ufcg-dark-blue text-white"
              >
                <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Editar Perfil
              </Button>
            ) : (
              <div className="flex space-x-2">
                <Button
                  onClick={handleSave}
                  loading={loading}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  Salvar
                </Button>
                <Button
                  onClick={handleCancel}
                  variant="outline"
                  className="border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  Cancelar
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Dados Pessoais */}
        <Card className="p-6">
          <div className="flex items-center space-x-4 mb-6">
            <div className="h-20 w-20 rounded-full bg-ufcg-blue flex items-center justify-center">
              <span className="text-2xl font-bold text-white">
                {user?.username?.charAt(0).toUpperCase() || 'U'}
              </span>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                {user?.username}
              </h2>
              <p className="text-gray-600">{user?.email || 'Email não informado'}</p>
              <p className="text-sm text-ufcg-blue font-medium">
                {user?.username === 'admin' ? 'Administrador do Sistema' : 'Usuário do Sistema'}
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
              Dados Pessoais
            </h3>
            
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nome de usuário
                </label>
                <p className="text-gray-900 py-2 px-3 bg-gray-50 rounded-md">
                  {user?.username}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  O nome de usuário não pode ser alterado
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  E-mail
                </label>
                {editing ? (
                  <Input
                    type="email"
                    value={profileData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    error={errors.email}
                    className="w-full"
                    placeholder="Digite seu email"
                  />
                ) : (
                  <p className="text-gray-900 py-2 px-3 bg-gray-50 rounded-md">
                    {user?.email || 'Email não informado'}
                  </p>
                )}
              </div>
            </div>
          </div>
        </Card>

        {/* Informações de Contato */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2 mb-4">
            Informações de Contato
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Telefone
              </label>
              {editing ? (
                <PhoneInput
                  value={profileData.telefone}
                  onChange={(value) => handleInputChange('telefone', value)}
                  error={errors.telefone}
                />
              ) : (
                <p className="text-gray-900 py-2 px-3 bg-gray-50 rounded-md">
                  {user?.telefone || 'Telefone não informado'}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Matrícula
              </label>
              <p className="text-gray-900 py-2 px-3 bg-gray-50 rounded-md">
                {profileData.matricula}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Data de Cadastro
              </label>
              <p className="text-gray-900 py-2 px-3 bg-gray-50 rounded-md">
                {user?.created_at ? new Date(user.created_at).toLocaleDateString('pt-BR') : '01/01/2024'}
              </p>
            </div>
          </div>
        </Card>

        {/* Configurações */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2 mb-4">
            Configurações
          </h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Receber notificações por email
                </label>
                <p className="text-xs text-gray-500">
                  Receba notificações sobre atividades do sistema
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={profileData.notifications}
                  onChange={(e) => handleInputChange('notifications', e.target.checked)}
                  className="sr-only peer"
                  disabled={!editing}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-ufcg-blue/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-ufcg-blue"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Modo escuro
                </label>
                <p className="text-xs text-gray-500">
                  Ativar tema escuro da interface
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={profileData.darkMode}
                  onChange={(e) => handleInputChange('darkMode', e.target.checked)}
                  className="sr-only peer"
                  disabled={!editing}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-ufcg-blue/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-ufcg-blue"></div>
              </label>
            </div>

            <div className="pt-4 space-y-3">
              <Button
                className="w-full justify-center bg-ufcg-light-blue hover:bg-ufcg-blue text-white"
                onClick={() => {
                  showToast('Funcionalidade em desenvolvimento', 'info');
                }}
              >
                <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v-2l-2.257-2.257A6 6 0 0112 5zm-6 6l3 3m0 0l-3-3m3 3V9a6 6 0 016-6v0a6 6 0 016 6v3" />
                </svg>
                Alterar Senha
              </Button>
              
              <Button
                variant="outline"
                className="w-full justify-center border-ufcg-blue text-ufcg-blue hover:bg-ufcg-blue hover:text-white"
                onClick={() => {
                  showToast('Funcionalidade em desenvolvimento', 'info');
                }}
              >
                <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Exportar Dados
              </Button>
            </div>
          </div>
        </Card>

        {/* Atividades Recentes */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2 mb-4">
            Atividades Recentes
          </h3>
          
          <div className="space-y-3">
            {recentActivities.map((activity) => (
              <div
                key={activity.id}
                className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="h-2 w-2 bg-ufcg-blue rounded-full flex-shrink-0"></div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {activity.action}
                  </p>
                  <p className="text-xs text-gray-500">
                    {activity.date} às {activity.time}
                  </p>
                </div>
              </div>
            ))}
            
            <Button
              variant="outline"
              className="w-full justify-center mt-4 border-ufcg-blue text-ufcg-blue hover:bg-ufcg-blue hover:text-white"
              onClick={() => {
                showToast('Funcionalidade em desenvolvimento', 'info');
              }}
            >
              Ver todas as atividades
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default UserProfile;