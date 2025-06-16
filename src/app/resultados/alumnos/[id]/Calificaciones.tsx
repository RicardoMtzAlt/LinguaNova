'use client'

import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { usuarios, resultados } from '@prisma/client'

type Props = {
  usuarios: usuarios[]
  resultados: resultados[]
}

export default function Resultados({ usuarios, resultados }: Props) {
  const { id } = useParams<{ id: string }>()
  const estudianteId = parseInt(id)
  const estudiante = usuarios.find(u => u.id === estudianteId)
  const resultadosEstudiante = resultados.filter(r => r.usuarioid === estudianteId)
  const router = useRouter()

  const handleGoBack = () => {
    router.back()
  }

  if (!estudiante) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800 px-6">
        <div className="max-w-2xl w-full bg-gray-800 text-center text-white p-8 rounded-xl shadow-xl">
          <h1 className="text-3xl font-bold mb-4 text-indigo-300">Resultados</h1>
          <p className="text-gray-300 mb-6">Estudiante no encontrado</p>
          <Link href="/resultados">
            <button className="bg-indigo-600 hover:bg-indigo-500 text-white font-medium px-6 py-2 rounded-lg transition shadow">
              Regresar
            </button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 px-6 py-10">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-extrabold text-indigo-200 text-center mb-8">
          Resultados de {estudiante.nombre}
        </h1>

        <div className="bg-gray-800 rounded-xl shadow-lg overflow-hidden">
          {resultadosEstudiante.length > 0 ? (
            <table className="min-w-full text-sm text-left text-gray-200">
              <thead className="bg-indigo-700/60 text-indigo-100">
                <tr>
                  <th className="px-6 py-4 border-b border-gray-600">Idioma</th>
                  <th className="px-6 py-4 border-b border-gray-600">Calificación</th>
                </tr>
              </thead>
              <tbody>
                {resultadosEstudiante.map((resultado, index) => (
                  <tr
                    key={resultado.id}
                    className={
                      index % 2 === 0
                        ? 'bg-gray-900/40 border-b border-gray-700'
                        : 'bg-gray-800 border-b border-gray-700'
                    }
                  >
                    <td className="px-6 py-3">{resultado.idioma}</td>
                    <td className="px-6 py-3">{resultado.calificacion}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="p-6 text-center text-gray-400">
              No hay resultados registrados.
            </div>
          )}
        </div>

        <div className="mt-8 text-center">
          <button
            onClick={handleGoBack}
            className="bg-indigo-600 hover:bg-indigo-500 transition text-white font-medium px-6 py-2 rounded-lg shadow"
          >
            Regresar
          </button>
        </div>
      </div>
    </div>
  )
}