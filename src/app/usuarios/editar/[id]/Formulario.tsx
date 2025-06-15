'use client'

import { useState } from 'react'
import { usuarios } from '@prisma/client'
import { useRouter } from 'next/navigation'

type Props = {
  usuario: usuarios
}

export default function FormularioUsuario({ usuario }: Props) {
  const router = useRouter()
  const [nombre, setNombre] = useState(usuario.nombre)
  const [correo, setCorreo] = useState(usuario.correo)
  const [contrasena, setcontrasena] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const body = {
      nombre,
      correo,
      contrasena,
    }

    const res = await fetch(`/api/usuarios/${usuario.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })

    if (res.ok) {
      setError('')
      setSuccess(true)

      
      setTimeout(async () => {
        await fetch('/api/logout') 
        router.push('/login')
      }, 2000)
    } else {
      const data = await res.json()
      setError(data.message || 'Error al actualizar usuario')
      setSuccess(false)
    }
  }

  return (
    <div className="max-w-md mx-auto mt-6 bg-white p-6 rounded-lg shadow-md">
      {success && (
        <div className="bg-green-100 text-green-800 text-center p-4 rounded font-semibold text-lg">
          ✅ Usuario actualizado. Cerrando sesión para aplicar cambios...
        </div>
      )}

      {error && (
        <div className="bg-red-100 text-red-800 text-center p-4 rounded font-semibold text-lg">
          ❌ {error}
        </div>
      )}

      {!success && (
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block mb-1 font-medium text-gray-700 text-lg">Nombre</label>
            <input
              type="text"
              value={nombre}
              onChange={e => setNombre(e.target.value)}
              className="border border-gray-300 text-gray-500 p-3 w-full rounded shadow-sm text-lg focus:outline-blue-500"
              required
            />
          </div>

          <div>
            <label className="block mb-1 font-medium text-gray-700 text-lg">Correo</label>
            <input
              type="email"
              value={correo}
              onChange={e => setCorreo(e.target.value)}
              className="border border-gray-300 text-gray-500 p-3 w-full rounded shadow-sm text-lg focus:outline-blue-500"
              required
            />
          </div>

          <div>
            <label className="block mb-1 font-medium text-gray-700 text-lg">Contraseña</label>
            <input
              type="password"
              value={contrasena}
              onChange={e => setcontrasena(e.target.value)}
              placeholder="(dejar vacío para no cambiar)"
              className="border border-gray-300 text-gray-500 p-3 w-full rounded shadow-sm text-lg focus:outline-blue-500"
            />
          </div>

          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white text-lg font-semibold px-4 py-3 rounded w-full transition"
          >
            💾 Guardar Cambios
          </button>
        </form>
      )}
    </div>
  )
}
