'use client'

import Link from 'next/link'
import { usuario } from '@prisma/client'

type Props = {
  usuarios: usuario[]
}

export default function Resultados({ usuarios }: Props) {
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center text-blue-700">Listado de Estudiantes</h1>

      <ul className="space-y-4">
        {usuarios
          .filter(usuario => usuario.rol === 'ESTUDIANTE')
          .map(usuario => (
            <li
              key={usuario.id}
              className="bg-white rounded-xl shadow p-6 border border-gray-200 hover:shadow-md transition"
            >
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
                <div>
                  <p className="text-lg font-semibold text-gray-800">{usuario.nombre}</p>
                  <p className="text-sm text-gray-600">{usuario.correo}</p>
                  <p className="text-xs text-gray-500 mt-1">{usuario.rol}</p>
                </div>
                <div className="mt-4 sm:mt-0">
                  <Link
                    href={`/resultados/alumnos/${usuario.id}`}
                    className="inline-block bg-blue-600 hover:bg-blue-700 transition-colors text-white text-sm font-medium px-4 py-2 rounded-lg shadow"
                  >
                    Ver Resultados
                  </Link>
                </div>
              </div>
            </li>
          ))}
      </ul>
    </div>
  )
}
