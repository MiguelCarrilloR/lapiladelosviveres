import { useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
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
    notification.className = `fixed top-4 left-1/2 transform -translate-x-1/2 px-6 py-3 rounded-lg text-white text-sm font-medium shadow-lg transition-all duration-500 ${
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
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-800 to-blue-900 flex items-center justify-center p-4">
      <div className="max-w-5xl w-full bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl flex overflow-hidden border border-white/20">
        {/* Left Side - Form */}
        <div className="w-full lg:w-1/2 p-8 lg:p-12">
          <div className="space-y-8">
            {/* Logo */}
            <div className="flex justify-center">
            </div>

            {/* Form */}
            <form onSubmit={handleLogin} className="space-y-6">
              <h1 className="text-3xl font-bold text-center text-white">
                Bienvenido de nuevo
              </h1>
              <p className="text-center text-gray-200">
                Ingresa tus credenciales para continuar
              </p>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-200 block mb-2">
                    Correo electrónico
                  </label>
                  <input
                    type="email"
                    className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all text-white placeholder-gray-400"
                    placeholder="ejemplo@correo.com"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-200 block mb-2">
                    Contraseña
                  </label>
                  <input
                    type="password"
                    className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all text-white placeholder-gray-400"
                    placeholder="••••••••"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium py-3 rounded-lg transition-all flex items-center justify-center space-x-3 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {loading ? (
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
                  ) : (
                    <>
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
                        <circle cx="8.5" cy="7" r="4" />
                        <path d="M20 8v6M23 11h-6" />
                      </svg>
                      <span>Iniciar Sesión</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Right Side - Image with new animated background */}
        <div className="hidden lg:block lg:w-1/2 relative overflow-hidden">
          <div className="absolute inset-0">
            {/* Animated geometric shapes */}
            <div className="absolute w-full h-full">
              <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
              <div className="absolute top-1/3 right-1/4 w-32 h-32 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse animation-delay-2000"></div>
              <div className="absolute bottom-1/4 left-1/3 w-32 h-32 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse animation-delay-4000"></div>
              
              {/* Floating particles */}
              <div className="absolute inset-0">
                {[...Array(20)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute w-2 h-2 bg-white rounded-full animate-float"
                    style={{
                      top: `${Math.random() * 100}%`,
                      left: `${Math.random() * 100}%`,
                      animationDelay: `${Math.random() * 5}s`,
                      animationDuration: `${5 + Math.random() * 5}s`
                    }}
                  ></div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Image container */}
          <div className="relative h-full flex items-center justify-center p-12">
            <img
              src="https://i.imgur.com/sMkhYLg.png"
              alt="Ilustración"
              className="relative z-10 rounded-lg transform hover:scale-105 transition-transform duration-500 drop-shadow-2xl"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginForm;