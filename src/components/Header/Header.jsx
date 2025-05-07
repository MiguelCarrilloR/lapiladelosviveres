import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { LogOut, Store, LayoutDashboard, ClipboardList } from "lucide-react";

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();

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
      "fixed top-4 left-1/2 -translate-x-1/2 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-fade-in";
    div.textContent = message;
    document.body.appendChild(div);

    setTimeout(() => {
      div.classList.add("opacity-0");
      setTimeout(() => document.body.removeChild(div), 300);
    }, 2700);
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center py-3 sm:py-0 space-y-3 sm:space-y-0">
          {/* Logo y nombre */}
          <Link 
            to="/dashboard" 
            className="flex items-center space-x-3 group"
          >
            <div className="w-10 h-10 bg-indigo-500 rounded-lg flex items-center justify-center shadow-md group-hover:bg-indigo-600 transition-colors duration-200">
              <Store className="w-6 h-6 text-white" />
            </div>
            <span className="text-gray-800 font-bold text-lg group-hover:text-indigo-600 transition-colors duration-200">
              La Pila de los Viveres
            </span>
          </Link>

          {/* Navegación principal */}
          <nav className="flex items-center space-x-1 sm:ml-8">
            <Link
              to="/dashboard"
              className={`px-4 py-4 flex items-center space-x-2 text-sm font-medium transition-colors duration-200 border-b-2 ${
                isActive("/dashboard")
                  ? "text-indigo-600 border-indigo-600"
                  : "text-gray-600 border-transparent hover:text-indigo-600 hover:border-indigo-600"
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Dashboard</span>
            </Link>
            <Link
              to="/inventario"
              className={`px-4 py-4 flex items-center space-x-2 text-sm font-medium transition-colors duration-200 border-b-2 ${
                isActive("/inventario")
                  ? "text-indigo-600 border-indigo-600"
                  : "text-gray-600 border-transparent hover:text-indigo-600 hover:border-indigo-600"
              }`}
            >
              <ClipboardList className="w-4 h-4" />
              <span>Inventario</span>
            </Link>
          </nav>

          {/* Espaciador */}
          <div className="flex-grow" />

          {/* Botón de cerrar sesión */}
          <button
            onClick={handleLogout}
            className="flex items-center space-x-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg transition-all duration-200 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            <LogOut className="w-4 h-4" />
            <span>Cerrar sesión</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;