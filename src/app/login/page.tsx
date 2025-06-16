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

        if (usuario && usuario.id) {
          login({
            id: usuario.id,
            nombre: '',
            correo: ''
          });
          router.push('/dashboard');
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800 p-4">
      <div className="w-full max-w-md bg-gray-800 rounded-xl shadow-xl overflow-hidden">
        <div className="bg-indigo-600 p-6 text-center">
          <h1 className="text-2xl font-bold text-white">LinguaNova</h1>
          <p className="text-indigo-100 mt-1 italic">“Tu viaje multilingüe comienza aquí”</p>
        </div>

        <div className="p-6 space-y-6">
          {mensaje && (
            <div className={`p-3 rounded-lg ${esError ? 'bg-red-200 text-red-900' : 'bg-green-200 text-green-900'} flex items-center`}>
              <svg
                className={`w-5 h-5 mr-2 ${esError ? 'text-red-700' : 'text-green-700'}`}
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
              <label htmlFor="correo" className="block text-sm font-medium text-gray-300 mb-1">
                Correo electrónico
              </label>
              <div className="relative">
                <input
                  id="correo"
                  type="email"
                  className="block w-full pl-3 pr-3 py-2 bg-gray-900 border border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 text-gray-200 placeholder-gray-500"
                  placeholder="correo@email.com"
                  value={correo}
                  onChange={(e) => setCorreo(e.target.value)}
                  onKeyPress={handleKeyPress}
                />
              </div>
            </div>

            <div>
              <label htmlFor="contrasena" className="block text-sm font-medium text-gray-300 mb-1">
                Contraseña
              </label>
              <div className="relative">
                <input
                  id="contrasena"
                  type="password"
                  className="block w-full pl-3 pr-3 py-2 bg-gray-900 border border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 text-gray-200 placeholder-gray-500"
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
                className={`w-full flex justify-center py-2 px-4 rounded-lg text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-500 transition duration-200 ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
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

            <div className="pt-4 text-center">
              <p className="text-sm text-gray-400">
                ¿No tienes cuenta?{' '}
                <button
                  type="button"
                  onClick={() => router.push('/usuarios/nuevo')}
                  className="font-medium text-indigo-400 hover:text-indigo-300 underline"
                >
                  Crear cuenta
                </button>
              </p>
            </div>
          </div>
        </div>

        <div className="px-6 py-4 bg-gray-900 text-center border-t border-gray-700">
          <p className="text-xs text-gray-500">
            ¿Problemas para ingresar?{' '}
            <a href="#" className="font-medium text-indigo-400 hover:text-indigo-300 underline">
              Contacta al administrador
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}