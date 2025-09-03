import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-ufcg-institutional text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          
          {/* Seção 1: Informações Institucionais */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white font-institutional">
              Universidade Federal de Campina Grande
            </h3>
            
            <div className="space-y-2 text-sm text-blue-200">
              <div>
                <p className="font-medium text-white mb-1">Endereço:</p>
                <p>Av. Aprígio Veloso - 882, Bairro Universitário</p>
                <p>Campina Grande - PB | CEP: 58429-900 - Brasil</p>
              </div>
              
              <div>
                <p className="font-medium text-white mb-1">Contato:</p>
                <p>E-mail: contato@ufcg.edu.br</p>
                <p>Telefone: (83) 2101-1000</p>
              </div>
            </div>
          </div>

          {/* Seção 2: Links Úteis */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white font-institutional">
              Links Úteis
            </h3>
            
            <nav className="space-y-2">
              <a 
                href="https://portal.ufcg.edu.br" 
                target="_blank" 
                rel="noopener noreferrer"
                className="block text-sm text-blue-200 hover:text-white transition-colors duration-200"
              >
                Portal UFCG
              </a>
              <a 
                href="https://pre.ufcg.edu.br" 
                target="_blank" 
                rel="noopener noreferrer"
                className="block text-sm text-blue-200 hover:text-white transition-colors duration-200"
              >
                Sistema Acadêmico
              </a>
              <a 
                href="https://biblioteca.ufcg.edu.br" 
                target="_blank" 
                rel="noopener noreferrer"
                className="block text-sm text-blue-200 hover:text-white transition-colors duration-200"
              >
                Biblioteca Central
              </a>
              <a 
                href="https://ouvidoria.ufcg.edu.br" 
                target="_blank" 
                rel="noopener noreferrer"
                className="block text-sm text-blue-200 hover:text-white transition-colors duration-200"
              >
                Ouvidoria
              </a>
            </nav>
          </div>

          {/* Seção 3: Redes Sociais */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white font-institutional">
              Redes Sociais
            </h3>
            
            <div className="space-y-3">
              <a 
                href="https://www.facebook.com/UFCGOficial/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center space-x-3 text-sm text-blue-200 hover:text-white transition-colors duration-200"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                <span>Facebook da UFCG</span>
              </a>

              <a 
                href="https://twitter.com/UFCG_Oficial" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center space-x-3 text-sm text-blue-200 hover:text-white transition-colors duration-200"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                </svg>
                <span>Twitter da UFCG</span>
              </a>

              <a 
                href="https://www.instagram.com/ufcg_oficial/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center space-x-3 text-sm text-blue-200 hover:text-white transition-colors duration-200"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.988 11.987 6.62 0 11.987-5.367 11.987-11.987C24.014 5.367 18.637.001 12.017.001zM8.449 16.988c-1.297 0-2.448-.49-3.323-1.297C4.198 14.895 3.708 13.744 3.708 12.447s.49-2.448 1.297-3.323c.875-.807 2.026-1.297 3.323-1.297s2.448.49 3.323 1.297c.807.875 1.297 2.026 1.297 3.323s-.49 2.448-1.297 3.323c-.875.807-2.026 1.297-3.323 1.297zm7.718-1.297c-.875.807-2.026 1.297-3.323 1.297s-2.448-.49-3.323-1.297c-.807-.875-1.297-2.026-1.297-3.323s.49-2.448 1.297-3.323c.875-.807 2.026-1.297 3.323-1.297s2.448.49 3.323 1.297c.807.875 1.297 2.026 1.297 3.323s-.49 2.448-1.297 3.323z"/>
                </svg>
                <span>Instagram da UFCG</span>
              </a>

              <a 
                href="https://www.youtube.com/@Conex%C3%A3oUFCG" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center space-x-3 text-sm text-blue-200 hover:text-white transition-colors duration-200"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
                <span>Canal do YouTube da UFCG</span>
              </a>
            </div>
          </div>
        </div>

        {/* Seção de Copyright */}
        <div className="border-t border-blue-700 mt-8 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-2 md:space-y-0">
            <p className="text-sm text-blue-200">
              © {new Date().getFullYear()} Universidade Federal de Campina Grande. Todos os direitos reservados.
            </p>
            <div className="text-sm text-blue-200">
              <span>PatrimonioTools v1.0</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;