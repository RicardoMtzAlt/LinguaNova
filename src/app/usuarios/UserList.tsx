'use client'

import Link from 'next/link'
import { useState } from 'react'
import { usuario } from '@prisma/client'

type Props = {
  usuarios: usuario[]
}

export default function UserList({ usuarios }: Props) {
  const [idParaEliminar, setIdParaEliminar] = useState<number | null>(null)
  const [nombreParaEliminar, setNombreParaEliminar] = useState<string | null>(null)

  const confirmarEliminacion = (id: number, nombre: string) => {
    setIdParaEliminar(id)
    setNombreParaEliminar(nombre)
  }

  const cancelar = () => {
    setIdParaEliminar(null)
    setNombreParaEliminar(null)
  }

  const eliminarUsuario = async () => {
    if (idParaEliminar === null) return

    try {
      const res = await fetch(`/api/usuarios/${idParaEliminar}`, {
        method: 'DELETE',
      })

      if (res.ok) {
        location.reload()
      } else {
        const data = await res.json()
        alert("Error al eliminar: " + (data?.error || "Desconocido"))
      }
    } catch (err) {
      console.error("Error en fetch DELETE:", err)
      alert("Ocurrió un error al intentar eliminar el usuario.")
    } finally {
      cancelar()
    }
  }

  return (
    <div>
      <ul className="mt-4 space-y-2">
        {usuarios.map((usuario) => (
          <li key={usuario.id} className="border p-2 rounded">
            <p>
              <strong>{usuario.nombre}</strong> ({usuario.rol})
            </p>
            <p>{usuario.correo}</p>
            <div className="mt-2 flex gap-4">
              <Link href={`/usuarios/editar/${usuario.id}`} className="text-green-500 hover:underline">
                Editar
              </Link>
              <button
                className="text-red-500 hover:underline cursor-pointer"
                onClick={() => confirmarEliminacion(usuario.id, usuario.nombre)}
              >
                Eliminar
              </button>
            </div>
          </li>
        ))}
      </ul>
      {idParaEliminar !== null && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg text-center">
            <p className="mb-4">¿Estás seguro que deseas eliminar a <strong>{nombreParaEliminar}</strong>?</p>
            <div className="flex justify-center gap-4">
              <button
                onClick={eliminarUsuario}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                Sí, eliminar
              </button>
              <button
                onClick={cancelar}
                className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
