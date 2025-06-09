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
    <div className="p-6 max-w-4xl mx-auto">

      <ul className="space-y-4">
        {usuarios.map((usuario) => (
          <li
            key={usuario.id}
            className="bg-white border border-gray-200 rounded-xl shadow p-6 hover:shadow-md transition"
          >
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
              <div>
                <p className="text-lg font-semibold text-gray-800">{usuario.nombre}</p>
                <p className="text-sm text-gray-600">{usuario.correo}</p>
                <p className="text-xs text-gray-500 mt-1">Rol: {usuario.rol}</p>
              </div>
              <div className="mt-4 sm:mt-0 flex gap-4">
                <Link
                  href={`/usuarios/editar/${usuario.id}`}
                  className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded text-sm shadow"
                >
                  Editar
                </Link>
                <button
                  onClick={() => confirmarEliminacion(usuario.id, usuario.nombre)}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded text-sm shadow"
                >
                  Eliminar
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>

      {/* Modal de confirmación */}
      {idParaEliminar !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-100 opacity-95"></div>
          <div className="relative bg-white w-full max-w-md p-6 rounded-xl shadow-lg text-center z-10">
            <h2 className="text-xl font-semibold mb-4 text-red-600">Confirmar eliminación</h2>
            <p className="mb-6 text-gray-800">
              ¿Estás seguro que deseas eliminar a <strong>{nombreParaEliminar}</strong>?
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={eliminarUsuario}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded shadow"
              >
                Sí, eliminar
              </button>
              <button
                onClick={cancelar}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded shadow"
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
