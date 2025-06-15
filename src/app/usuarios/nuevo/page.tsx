"use client";

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
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white shadow-lg rounded-lg p-10 w-full max-w-xl">
        <h1 className="text-4xl font-bold mb-8 text-center text-blue-700">Crear Cuenta</h1>

        {error && (
          <p className="text-red-600 bg-red-100 border border-red-300 rounded p-4 mb-5 text-lg font-semibold">
            {error}
          </p>
        )}

        {success && (
          <p className="text-green-700 bg-green-100 border border-green-300 rounded p-4 mb-5 text-lg font-semibold text-center">
            Usuario creado exitosamente. Redirigiendo...
          </p>
        )}

        {!success && (
          <form onSubmit={handleSubmit} className="space-y-6">
            <input
              type="text"
              placeholder="Nombre"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className="border border-gray-300 p-4 w-full rounded text-2xl font-medium text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
            <input
              type="email"
              placeholder="Correo"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              className="border border-gray-300 p-4 w-full rounded text-2xl font-medium text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
            <input
              type="password"
              placeholder="Contraseña"
              value={contrasena}
              onChange={(e) => setcontrasena(e.target.value)}
              className="border border-gray-300 p-4 w-full rounded text-2xl font-medium text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 text-2xl rounded shadow-md transition duration-300"
            >
              Crear Cuenta
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
