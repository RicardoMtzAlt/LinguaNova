'use client'

import { useState } from 'react'
import { usuario } from '@prisma/client'
import { useRouter } from 'next/navigation'

type Props = {
  usuario: usuario
}

export default function FormularioUsuario({ usuario }: Props) {
  const router = useRouter()
  const [nombre, setNombre] = useState(usuario.nombre)
  const [correo, setCorreo] = useState(usuario.correo)
  const [rol, setRol] = useState(usuario.rol)
  const [contrasena, setcontrasena] = useState('') 
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const body = {
      nombre,
      correo,
      rol,
      contrasena 
    }

    const res = await fetch(`/api/usuarios/${usuario.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    })

    if (res.ok) {
      router.push('/usuarios')
    } else {
      const data = await res.json()
      setError(data.message || 'Error al actualizar usuario')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
      {error && <p className="text-red-500">{error}</p>}
      <input
        type="text"
        value={nombre}
        onChange={e => setNombre(e.target.value)}
        placeholder="Nombre"
        className="border p-2 w-full rounded"
        required
      />
      <input
        type="email"
        value={correo}
        onChange={e => setCorreo(e.target.value)}
        placeholder="Correo"
        className="border p-2 w-full rounded"
        required
      />
      <select
        value={rol}
        onChange={e => setRol(e.target.value as usuario['rol'])}
        className="border p-2 w-full rounded"
      >
        <option value="ESTUDIANTE">Estudiante</option>
        <option value="PROFESOR">Profesor</option>
      </select>

      <input
        type="password"
        value={contrasena}
        onChange={e => setcontrasena(e.target.value)}
        placeholder="contrasena (dejar vacío para no cambiar)"
        className="border p-2 w-full rounded"
      />
      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
        Guardar Cambios
      </button>
    </form>
  )
}
