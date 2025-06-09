'use client'

import Link from 'next/link'
import { usuario } from '@prisma/client'

type Props = {
  usuarios: usuario[]
}

export default function Resultados({ usuarios }: Props) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="w-full max-w-4xl bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="bg-indigo-300 p-6 text-center">
          <h1 className="text-3xl font-bold text-white">Listado de Estudiantes</h1>
          <p className="text-indigo-100 mt-1">Haz clic en un estudiante para ver sus resultados</p>
        </div>

        <div className="p-6 space-y-4">
          {usuarios
            .filter(usuario => usuario.rol === 'ESTUDIANTE')
            .map(usuario => (
              <div
                key={usuario.id}
                className="bg-white rounded-lg shadow p-4 border border-gray-200 hover:shadow-md transition"
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
              </div>
            ))}
        </div>

        <div className="px-6 py-4 bg-gray-50 text-center">
          <p className="text-xs text-gray-500">
            ¿No encuentras a un estudiante?{' '}
            <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500">
              Contacta al administrador
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
