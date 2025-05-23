import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { LogOut, Store, LayoutDashboard, ClipboardList, Menu, X } from "lucide-react";

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isActive = (path) => {
    return location.pathname === path;
  };

  const handleLogout = () => {
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userPassword");
    
    showNotification("¡Sesión cerrada correctamente!");
    navigate("/");
  };

  const showNotification = (message) => {
    const div = document.createElement("div");
    div.className = 
      "fixed top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-3 rounded-xl shadow-lg z-50 animate-fade-in backdrop-blur-sm";
    div.textContent = message;
    document.body.appendChild(div);

    setTimeout(() => {
      div.classList.add("opacity-0");
      setTimeout(() => document.body.removeChild(div), 300);
    }, 2700);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      {/* Overlay para cerrar menú móvil - Movido fuera del header */}
      {isMobileMenuOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
          onClick={closeMobileMenu}
        />
      )}

      <header className="bg-gradient-to-r from-slate-900 via-purple-900 to-slate-900 backdrop-blur-xl border-b border-white/10 sticky top-0 z-50 shadow-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            {/* Logo y nombre */}
            <Link 
              to="/dashboard" 
              className="flex items-center space-x-3 group"
              onClick={closeMobileMenu}
            >
              <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-purple-500/25 transition-all duration-300 group-hover:scale-105">
                <Store className="w-6 h-6 text-white" />
              </div>
              <span className="text-white font-bold text-lg group-hover:text-purple-300 transition-colors duration-300 hidden sm:inline-block">
                La Pila de los Viveres
              </span>
              <span className="text-white font-bold text-base group-hover:text-purple-300 transition-colors duration-300 sm:hidden">
                La Pila
              </span>
            </Link>

            {/* Navegación principal - Desktop */}
            <nav className="hidden md:flex items-center space-x-1">
              <Link
                to="/dashboard"
                className={`px-4 py-2 flex items-center space-x-2 text-sm font-medium transition-all duration-300 rounded-lg ${
                  isActive("/dashboard")
                    ? "text-white bg-white/10 backdrop-blur-sm shadow-lg border border-white/20"
                    : "text-gray-300 hover:text-white hover:bg-white/5 border border-transparent"
                }`}
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>Dashboard</span>
              </Link>
              <Link
                to="/inventario"
                className={`px-4 py-2 flex items-center space-x-2 text-sm font-medium transition-all duration-300 rounded-lg ${
                  isActive("/inventario")
                    ? "text-white bg-white/10 backdrop-blur-sm shadow-lg border border-white/20"
                    : "text-gray-300 hover:text-white hover:bg-white/5 border border-transparent"
                }`}
              >
                <ClipboardList className="w-4 h-4" />
                <span>Inventario</span>
              </Link>
            </nav>

            {/* Botón de cerrar sesión - Desktop */}
            <button
              onClick={handleLogout}
              className="hidden md:flex items-center space-x-2 bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white px-4 py-2 rounded-lg transition-all duration-300 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-purple-500/50 backdrop-blur-sm border border-white/10 hover:border-white/20"
            >
              <LogOut className="w-4 h-4" />
              <span>Cerrar sesión</span>
            </button>

            {/* Botón de menú móvil */}
            <button
              onClick={toggleMobileMenu}
              className="md:hidden flex items-center justify-center w-10 h-10 rounded-lg bg-white/5 hover:bg-white/10 transition-all duration-300 border border-white/10 relative z-50"
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5 text-white" />
              ) : (
                <Menu className="w-5 h-5 text-white" />
              )}
            </button>
          </div>

          {/* Menú móvil */}
          <div className={`md:hidden transition-all duration-300 ease-in-out relative z-50 ${
            isMobileMenuOpen 
              ? 'max-h-64 opacity-100 pb-4' 
              : 'max-h-0 opacity-0 overflow-hidden'
          }`}>
            <div className="pt-4 space-y-2">
              
              {/* Navegación móvil */}
              <Link
                to="/dashboard"
                onClick={closeMobileMenu}
                className={`flex items-center space-x-3 px-4 py-3 text-sm font-medium transition-all duration-300 rounded-lg relative z-50 ${
                  isActive("/dashboard")
                    ? "text-white bg-white/10 backdrop-blur-sm shadow-lg border border-white/20"
                    : "text-gray-300 hover:text-white hover:bg-white/5"
                }`}
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>Dashboard</span>
              </Link>
              
              <Link
                to="/inventario"
                onClick={closeMobileMenu}
                className={`flex items-center space-x-3 px-4 py-3 text-sm font-medium transition-all duration-300 rounded-lg relative z-50 ${
                  isActive("/inventario")
                    ? "text-white bg-white/10 backdrop-blur-sm shadow-lg border border-white/20"
                    : "text-gray-300 hover:text-white hover:bg-white/5"
                }`}
              >
                <ClipboardList className="w-4 h-4" />
                <span>Inventario</span>
              </Link>

              {/* Separador */}
              <div className="h-px bg-white/10 my-3"></div>

              {/* Botón de cerrar sesión móvil */}
              <button
                onClick={() => {
                  handleLogout();
                  closeMobileMenu();
                }}
                className="w-full flex items-center space-x-3 px-4 py-3 text-sm font-medium text-gray-300 hover:text-white hover:bg-white/5 transition-all duration-300 rounded-lg relative z-50"
              >
                <LogOut className="w-4 h-4" />
                <span>Cerrar sesión</span>
              </button>
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;