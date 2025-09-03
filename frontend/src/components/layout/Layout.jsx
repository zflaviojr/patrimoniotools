import React from 'react';
import Header from './Header';
import Footer from './Footer';

const Layout = ({ children, className = '' }) => {
  return (
    <div className={`min-h-screen flex flex-col bg-gray-50 ${className}`}>
      <Header />
      
      {/* Main Content Area */}
      <main className="flex-1 flex flex-col">
        {children}
      </main>
      
      <Footer />
    </div>
  );
};

export default Layout;