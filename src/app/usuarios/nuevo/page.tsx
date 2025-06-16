'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NuevoUsuarioPage() {
  const router = useRouter();
  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [contrasena, setcontrasena] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch("/api/usuarios", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nombre, correo, contrasena }),
    });

    if (res.ok) {
      setSuccess(true);
      setError("");
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } else {
      const data = await res.json();
      setError(data.message || "Error al crear usuario");
      setSuccess(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800 px-4">
      <div className="bg-gray-800 shadow-2xl rounded-xl p-10 w-full max-w-xl">
        <h1 className="text-4xl font-bold mb-8 text-center text-indigo-200">
          🌟 Crea tu cuenta en <span className="text-white">LinguaNova</span>
        </h1>

        {error && (
          <p className="text-red-200 bg-red-900/30 border border-red-500 rounded p-4 mb-5 text-base font-medium text-center">
            {error}
          </p>
        )}

        {success && (
          <p className="text-green-200 bg-green-800/30 border border-green-500 rounded p-4 mb-5 text-base font-medium text-center">
            Usuario creado exitosamente. Redirigiendo...
          </p>
        )}

        {!success && (
          <form onSubmit={handleSubmit} className="space-y-5">
            <input
              type="text"
              placeholder="Nombre completo"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className="bg-gray-900 border border-gray-700 p-4 w-full rounded-lg text-base text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
            <input
              type="email"
              placeholder="Correo electrónico"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              className="bg-gray-900 border border-gray-700 p-4 w-full rounded-lg text-base text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
            <input
              type="password"
              placeholder="Contraseña"
              value={contrasena}
              onChange={(e) => setcontrasena(e.target.value)}
              className="bg-gray-900 border border-gray-700 p-4 w-full rounded-lg text-base text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
            <button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 rounded-lg shadow-md transition duration-300"
            >
              Crear Cuenta
            </button>
          </form>
        )}
      </div>
    </div>
  );
}