'use client';

import { useState } from 'react';

export default function LoginPage() {
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [esError, setEsError] = useState(false);

  const handleLogin = async () => {
    setMensaje(''); // limpia mensaje anterior

    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ correo, contrasena }),
    });

    const data = await res.json();

    if (res.ok) {
      setMensaje(data.message || 'Login exitoso');
      setEsError(false);
      // Puedes redirigir aquí
    } else {
      setMensaje(data.message || 'Error de autenticación');
      setEsError(true);
    }
  };

  return (
    <div className="space-y-4 max-w-md mx-auto p-4">
      <h1 className="text-xl font-semibold">Iniciar Sesión</h1>

      {mensaje && (
        <p className={`p-2 rounded ${esError ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
          {mensaje}
        </p>
      )}

      <input
        type="email"
        className="border p-2 w-full rounded"
        placeholder="Correo"
        value={correo}
        onChange={(e) => setCorreo(e.target.value)}
      />
      <input
        type="password"
        className="border p-2 w-full rounded"
        placeholder="Contraseña"
        value={contrasena}
        onChange={(e) => setContrasena(e.target.value)}
      />
      <button
        onClick={handleLogin}
        className="bg-blue-600 text-white px-4 py-2 rounded w-full"
      >
        Entrar
      </button>
    </div>
  );
}
