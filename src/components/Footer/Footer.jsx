import React from 'react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          {/* Logo y copyright */}
          <div className="flex items-center space-x-2">
            <span className="text-gray-600 font-medium">Sistema de Inventario</span>
            <span className="text-gray-400">|</span>
            <span className="text-gray-500 text-sm">
              &copy; {currentYear} Todos los derechos reservados
            </span>
          </div>

          {/* Links del sistema */}
          <div className="flex items-center space-x-6">
            <a 
              href="/dashboard" 
              className="text-gray-500 hover:text-gray-700 text-sm transition-colors"
            >
              Dashboard
            </a>
            <a 
              href="/inventario" 
              className="text-gray-500 hover:text-gray-700 text-sm transition-colors"
            >
              Inventario
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;