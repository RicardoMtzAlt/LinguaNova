"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NuevoUsuarioPage() {
  const router = useRouter();
  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [rol, setRol] = useState("ESTUDIANTE");
  const [contrasena, setcontrasena] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch("/api/usuarios", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nombre, correo, rol, contrasena }),
    });

    if (res.ok) {
      router.push("/usuarios");
    } else {
      const data = await res.json();
      setError(data.message || "Error al crear usuario");
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-xl font-bold mb-4">Nuevo Usuario</h1>
      {error && <p className="text-red-500 mb-2">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Nombre"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          className="border p-2 w-full rounded"
          required
        />
        <input
          type="email"
          placeholder="Correo"
          value={correo}
          onChange={(e) => setCorreo(e.target.value)}
          className="border p-2 w-full rounded"
          required
        />
        <select
          value={rol}
          onChange={(e) => setRol(e.target.value)}
          className="border p-2 w-full rounded"
        >
          <option value="ESTUDIANTE">Estudiante</option>
          <option value="PROFESOR">Profesor</option>
        </select>
        <input
          type="password"
          placeholder="contrasena"
          value={contrasena}
          onChange={(e) => setcontrasena(e.target.value)}
          className="border p-2 w-full rounded"
          required
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Crear Usuario
        </button>
      </form>
    </div>
  );
}
