import { useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!email || !password) {
      showNotification("Por favor completa todos los campos", "error");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        "https://mi-backend-qjzmi4zc5q-uc.a.run.app/api/users/login",
        {
          email,
          password,
        }
      );

      if (response.status === 200) {
        localStorage.setItem("userEmail", email);
        localStorage.setItem("userPassword", password);
        showNotification("¡Inicio de Sesión Correcto!", "success");
        navigate("/dashboard");
      }
    } catch (error) {
      const message = error.response?.data?.message || "Credenciales inválidas";
      showNotification(`Error: ${message}`, "error");
    } finally {
      setLoading(false);
    }
  };

  const showNotification = (message, type) => {
    const notification = document.createElement("div");
    notification.className = `fixed top-4 left-1/2 transform -translate-x-1/2 px-6 py-3 rounded-lg text-white text-sm font-medium shadow-lg transition-all duration-500 z-50 ${
      type === "success" ? "bg-green-500" : "bg-red-500"
    }`;
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
      notification.style.opacity = "0";
      setTimeout(() => document.body.removeChild(notification), 500);
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <div className="max-w-6xl w-full bg-white/5 backdrop-blur-xl rounded-3xl shadow-2xl flex overflow-hidden border border-white/10">
        
        {/* Left Side - Form */}
        <div className="w-full lg:w-1/2 p-8 lg:p-12 flex items-center">
          <div className="w-full space-y-8">
            
            {/* Header */}
            <div className="text-center space-y-2">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 mb-4 shadow-lg">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2L2 7v10c0 5.55 3.84 10 9 10s9-4.45 9-10V7l-10-5z"/>
                  <path d="M12 22s8-4 8-10V7l-8-5-8 5v5c0 6 8 10 8 10z"/>
                </svg>
              </div>
              <h1 className="text-4xl font-bold text-white mb-2">
                Bienvenido de nuevo
              </h1>
              <p className="text-gray-300 text-lg">
                Ingresa tus credenciales para acceder a tu cuenta
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-5">
                
                {/* Email Input */}
                <div className="group">
                  <label className="text-sm font-semibold text-gray-200 block mb-3">
                    Correo electrónico
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      className="w-full px-4 py-4 rounded-xl bg-white/5 border border-white/10 focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 outline-none transition-all duration-300 text-white placeholder-gray-400 hover:bg-white/10"
                      placeholder="ejemplo@correo.com"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-4">
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                        <polyline points="22,6 12,13 2,6"/>
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Password Input */}
                <div className="group">
                  <label className="text-sm font-semibold text-gray-200 block mb-3">
                    Contraseña
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      className="w-full px-4 py-4 rounded-xl bg-white/5 border border-white/10 focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 outline-none transition-all duration-300 text-white placeholder-gray-400 hover:bg-white/10"
                      placeholder="••••••••"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-400 hover:text-white transition-colors"
                    >
                      {showPassword ? (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                          <line x1="1" y1="1" x2="23" y2="23"/>
                        </svg>
                      ) : (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                          <circle cx="12" cy="12" r="3"/>
                        </svg>
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Login Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-4 rounded-xl transition-all duration-300 flex items-center justify-center space-x-3 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl"
                >
                  {loading ? (
                    <div className="flex items-center space-x-2">
                      <svg
                        className="animate-spin h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      <span>Iniciando sesión...</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/>
                        <polyline points="10,17 15,12 10,7"/>
                        <line x1="15" y1="12" x2="3" y2="12"/>
                      </svg>
                      <span>Iniciar Sesión</span>
                    </div>
                  )}
                </button>
              </div>
            </form>

            {/* Footer */}
            <div className="text-center pt-4">
              <p className="text-gray-400 text-sm">
                ¿Problemas para acceder? 
                <span className="text-purple-400 hover:text-purple-300 cursor-pointer ml-1 transition-colors">
                  Contacta soporte
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* Right Side - Clean Image Display */}
        <div className="hidden lg:block lg:w-1/2 relative overflow-hidden">
          {/* Subtle animated background */}
          <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 to-pink-900/20">
            <div className="absolute inset-0">
              {/* Subtle floating orbs */}
              <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-600/10 rounded-full blur-3xl animate-pulse"></div>
              <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-pink-600/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
            </div>
          </div>
          
          {/* Image container with clean presentation */}
          <div className="relative h-full flex items-center justify-center p-16">
            <div className="relative group">
              {/* Glow effect behind image */}
              <div className="absolute -inset-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl blur-2xl opacity-25 group-hover:opacity-40 transition-opacity duration-500"></div>
              
              {/* Main image */}
              <div className="relative bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
                <img
                  src="https://i.imgur.com/SkrMqOK.png"
                  alt="Ilustración"
                  className="w-full h-auto max-w-sm mx-auto rounded-xl shadow-2xl transform group-hover:scale-105 transition-all duration-500"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}

export default LoginForm;