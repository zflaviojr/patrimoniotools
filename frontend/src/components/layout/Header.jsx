import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { useLogout } from '../../hooks/useAuth.js';
import { Button } from '../common/index.js';

const Header = () => {
  const { user } = useAuth();
  const { handleLogout } = useLogout();
  const navigate = useNavigate();
  const location = useLocation();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Determinar qual link mostrar com base na rota atual
  const isInDescricoes = location.pathname.startsWith('/descricoes');
  const isInResponsaveis = location.pathname.startsWith('/responsaveis');
  const isOutsideDashboard = !location.pathname.startsWith('/dashboard') && location.pathname !== '/';

  const handleLogoutClick = async () => {
    setUserMenuOpen(false);
    await handleLogout();
  };

  const handleProfileClick = () => {
    setUserMenuOpen(false);
    navigate('/profile');
  };

  return (
    <header className="bg-ufcg-institutional text-white shadow-ufcg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-24">
          
          {/* Logo UFCG e Branding */}
          <div className="flex items-center space-x-4">
            {/* Logo UFCG */}
            <a 
              href="https://portal.ufcg.edu.br" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex-shrink-0"
            >
              <div className="h-22 w-22 bg-transparent rounded-lg flex items-center justify-center hover:bg-blue-800 transition-colors">
                <img 
                  src="https://apps.sti.ufcg.edu.br/resultados-processos-seletivos/2/_next/image?url=%2Fresultados-processos-seletivos%2F2%2Flogo_ufcg_nova_transparente_branca.png&w=96&q=75" 
                  alt="Logo UFCG" 
                  className="h-22 w-22 object-contain"
                />
              </div>
            </a>
            
            {/* Branding PatrimonioTools */}
            <div className="flex flex-col">
              <h1 className="text-xl font-bold font-institutional text-white leading-tight">
                PatrimonioTools
              </h1>
              <p className="text-sm text-ufcg-light-gray font-institutional">
                Sistema de Gestão de Patrimônio - UFCG
              </p>
            </div>
          </div>

          {/* Navegação Central */}
          <nav className="hidden lg:flex space-x-8">
            {isOutsideDashboard && (
              <>
                <a 
                  href="/dashboard" 
                  className="text-blue-200 hover:text-white transition-colors duration-200 font-medium"
                >
                  Dashboard
                </a>
                {isInDescricoes && (
                  <a 
                    href="/responsaveis" 
                    className="text-blue-200 hover:text-white transition-colors duration-200 font-medium"
                  >
                    Responsáveis
                  </a>
                )}
                {isInResponsaveis && (
                  <a 
                    href="/descricoes" 
                    className="text-blue-200 hover:text-white transition-colors duration-200 font-medium"
                  >
                    Descrições
                  </a>
                )}
                {!isInDescricoes && !isInResponsaveis && (
                  <>
                    <a 
                      href="/responsaveis" 
                      className="text-blue-200 hover:text-white transition-colors duration-200 font-medium"
                    >
                      Responsáveis
                    </a>
                    <a 
                      href="/descricoes" 
                      className="text-blue-200 hover:text-white transition-colors duration-200 font-medium"
                    >
                      Descrições
                    </a>
                  </>
                )}
              </>
            )}
          </nav>

          {/* Menu do Usuário */}
          <div className="flex items-center space-x-4">
            
            {/* Notificações */}
            <button className="text-blue-200 hover:text-white transition-colors duration-200 p-2 rounded-lg hover:bg-blue-800">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4l2 2h4a2 2 0 012 2v1" />
              </svg>
            </button>

            {/* Menu Mobile Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden text-blue-200 hover:text-white transition-colors duration-200 p-2 rounded-lg hover:bg-blue-800"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            {/* Menu dropdown do usuário */}
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center space-x-3 text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 hover:bg-blue-800 transition-colors duration-200 p-2"
              >
                <div className="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center ring-2 ring-white">
                  <span className="text-sm font-bold text-white">
                    {user?.username?.charAt(0).toUpperCase() || 'U'}
                  </span>
                </div>
                <div className="hidden md:block text-left">
                  <p className="text-sm font-semibold text-white">
                    {user?.username || 'Usuário'}
                  </p>
                  <p className="text-xs text-blue-200">
                    Administrador
                  </p>
                </div>
                <svg className="h-4 w-4 text-blue-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Dropdown menu */}
              {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg py-2 z-50 border border-gray-200">
                  <div className="px-4 py-3 border-b border-gray-100">
                    <p className="text-sm font-semibold text-gray-900">
                      {user?.username}
                    </p>
                    <p className="text-xs text-gray-500">
                      {user?.email || 'admin@sistema.com'}
                    </p>
                  </div>
                  
                  <button
                    onClick={handleProfileClick}
                    className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 transition-colors duration-200"
                  >
                    <svg className="h-4 w-4 mr-3 text-ufcg-institutional" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    Meu Perfil
                  </button>
                  
                  <button
                    onClick={() => setUserMenuOpen(false)}
                    className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 transition-colors duration-200"
                  >
                    <svg className="h-4 w-4 mr-3 text-ufcg-institutional" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Configurações
                  </button>
                  
                  <div className="border-t border-gray-100 mt-2">
                    <button
                      onClick={handleLogoutClick}
                      className="flex items-center w-full text-left px-4 py-2 text-sm text-red-700 hover:bg-red-50 transition-colors duration-200"
                    >
                      <svg className="h-4 w-4 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      Sair
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Menu Mobile */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-blue-700 mt-4 pt-4 pb-4">
            <nav className="space-y-2">
              <a 
                href="/dashboard" 
                className="block text-blue-200 hover:text-white transition-colors duration-200 font-medium py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Dashboard
              </a>
              {isOutsideDashboard && (
                <>
                  {isInDescricoes && (
                    <a 
                      href="/responsaveis" 
                      className="block text-blue-200 hover:text-white transition-colors duration-200 font-medium py-2"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Responsáveis
                    </a>
                  )}
                  {isInResponsaveis && (
                    <a 
                      href="/descricoes" 
                      className="block text-blue-200 hover:text-white transition-colors duration-200 font-medium py-2"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Descrições
                    </a>
                  )}
                  {!isInDescricoes && !isInResponsaveis && (
                    <>
                      <a 
                        href="/responsaveis" 
                        className="block text-blue-200 hover:text-white transition-colors duration-200 font-medium py-2"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Responsáveis
                      </a>
                      <a 
                        href="/descricoes" 
                        className="block text-blue-200 hover:text-white transition-colors duration-200 font-medium py-2"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Descrições
                      </a>
                    </>
                  )}
                </>
              )}
            </nav>
          </div>
        )}
      </div>

      {/* Overlay para fechar menus quando clicar fora */}
      {(userMenuOpen || mobileMenuOpen) && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => {
            setUserMenuOpen(false);
            setMobileMenuOpen(false);
          }}
        />
      )}
    </header>
  );
};

export default Header;