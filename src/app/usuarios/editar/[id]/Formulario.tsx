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

    const body = { nombre, correo, contrasena }

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
    <div className="max-w-md mx-auto mt-6 bg-gray-800 p-6 rounded-lg shadow-xl">
      {success && (
        <div className="bg-green-900/40 text-green-300 text-center p-4 rounded font-medium text-base">
          ✅ Usuario actualizado. Cerrando sesión para aplicar cambios...
        </div>
      )}

      {error && (
        <div className="bg-red-800/40 text-red-300 text-center p-4 rounded font-medium text-base">
          ❌ {error}
        </div>
      )}

      {!success && (
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block mb-1 text-indigo-200 font-medium text-sm">Nombre</label>
            <input
              type="text"
              value={nombre}
              onChange={e => setNombre(e.target.value)}
              className="bg-gray-900 border border-gray-700 text-gray-100 p-3 w-full rounded-md focus:ring-2 focus:ring-indigo-500 text-base placeholder-gray-500"
              required
            />
          </div>

          <div>
            <label className="block mb-1 text-indigo-200 font-medium text-sm">Correo</label>
            <input
              type="email"
              value={correo}
              onChange={e => setCorreo(e.target.value)}
              className="bg-gray-900 border border-gray-700 text-gray-100 p-3 w-full rounded-md focus:ring-2 focus:ring-indigo-500 text-base placeholder-gray-500"
              required
            />
          </div>

          <div>
            <label className="block mb-1 text-indigo-200 font-medium text-sm">Contraseña</label>
            <input
              type="password"
              value={contrasena}
              onChange={e => setcontrasena(e.target.value)}
              placeholder="(dejar vacío para no cambiar)"
              className="bg-gray-900 border border-gray-700 text-gray-100 p-3 w-full rounded-md focus:ring-2 focus:ring-indigo-500 text-base placeholder-gray-500"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 rounded-lg transition duration-300"
          >
            💾 Guardar Cambios
          </button>
        </form>
      )}
    </div>
  )
}