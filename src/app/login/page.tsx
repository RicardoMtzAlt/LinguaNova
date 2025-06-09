'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/app/context/UserContext';

export default function LoginPage() {
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [esError, setEsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { login } = useUser();

  const handleLogin = async () => {
    setIsLoading(true);
    setMensaje('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ correo, contrasena }),
      });

      const data = await res.json();

      if (res.ok) {
        setMensaje(data.message || '¡Bienvenido!');
        setEsError(false);

        const usuario = data.usuario;

        if (usuario && usuario.id && usuario.rol) {
          login({ id: usuario.id, rol: usuario.rol });

          // Redirige según el rol
          switch (usuario.rol) {
            case 'ESTUDIANTE':
              router.push('/dashboard');
              break;
            case 'PROFESOR':
              router.push('/resultados');
              break;
            case 'ADMINISTRADOR':
              router.push('/usuarios');
              break;
            default:
              setMensaje('Rol no reconocido.');
              setEsError(true);
          }
        } else {
          setMensaje('Respuesta inesperada del servidor.');
          setEsError(true);
        }
      } else {
        setMensaje(data.message || 'Error de autenticación');
        setEsError(true);
      }
    } catch (error) {
      setMensaje('Error de conexión con el servidor');
      setEsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleLogin();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="bg-indigo-300 p-6 text-center">
          <h1 className="text-2xl font-bold text-white">Sistema de Simulación de Exámenes</h1>
          <p className="text-indigo-100 mt-1">Ingresa tus credenciales para continuar</p>
        </div>

        <div className="p-6 space-y-6">
          {mensaje && (
            <div className={`p-3 rounded-lg ${esError ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'} flex items-center`}>
              <svg
                className={`w-5 h-5 mr-2 ${esError ? 'text-red-500' : 'text-green-500'}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d={esError ? "M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" : "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"}
                />
              </svg>
              {mensaje}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label htmlFor="correo" className="block text-sm font-medium text-gray-700 mb-1">
                Correo electrónico
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg
                    className="h-5 w-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <input
                  id="correo"
                  type="email"
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-800 placeholder-gray-400" 
                  placeholder="tu@correo.com"
                  value={correo}
                  onChange={(e) => setCorreo(e.target.value)}
                  onKeyPress={handleKeyPress}
                />
              </div>
            </div>

            <div>
              <label htmlFor="contrasena" className="block text-sm font-medium text-gray-700 mb-1">
                Contraseña
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg
                    className="h-5 w-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                </div>
                <input
                  id="contrasena"
                  type="password"
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-800 placeholder-gray-400"
                  placeholder="••••••••"
                  value={contrasena}
                  onChange={(e) => setContrasena(e.target.value)}
                  onKeyPress={handleKeyPress}
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={handleLogin}
                disabled={isLoading}
                className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Procesando...
                  </>
                ) : 'Iniciar sesión'}
              </button>
            </div>
          </div>
        </div>

        <div className="px-6 py-4 bg-gray-50 text-center">
          <p className="text-xs text-gray-500">
            ¿Problemas para ingresar?{' '}
            <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500">
              Contacta al administrador
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
