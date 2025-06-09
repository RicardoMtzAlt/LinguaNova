'use client'

import Link from 'next/link'
import { useParams } from 'next/navigation'
import { usuario, resultado } from '@prisma/client'
import { useRouter } from 'next/navigation'

type Props = {
  usuarios: usuario[]
  resultados: resultado[]
}

export default function Resultados({ usuarios, resultados }: Props) {

  const { id } = useParams<{ id: string }>()
  const estudianteId = parseInt(id)
  const estudiante = usuarios.find(u => u.id === estudianteId && u.rol === "ESTUDIANTE")
  const resultadosEstudiante = resultados.filter(r => r.estudiante_id === estudianteId)

  const router = useRouter()

  const handleGoBack = () => {
    router.back()
  }

  if (!estudiante) {
    return (
      <div className="p-6 max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-center text-blue-700">Resultados</h1>
        <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
          <p className="text-gray-700 text-lg">Estudiante no encontrado o no tiene permisos</p>
          <div className="mt-6">
            <Link href="/resultados">
              <button className="bg-blue-600 hover:bg-blue-700 transition-colors text-white font-medium px-6 py-2 rounded-lg shadow">
                Regresar
              </button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold text-blue-700 mb-8 text-center">
        Resultados de {estudiante.nombre}
      </h1>

      <div className="bg-white rounded-2xl shadow overflow-hidden">
        {resultadosEstudiante.length > 0 ? (
          <table className="min-w-full text-sm text-left text-gray-700">
            <thead className="bg-blue-100 text-blue-800">
              <tr>
                <th className="px-6 py-4 border-b">Título del Examen</th>
                <th className="px-6 py-4 border-b">Calificación</th>
              </tr>
            </thead>
            <tbody>
              {resultadosEstudiante.map((resultado, index) => (
                <tr
                  key={resultado.id}
                  className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}
                >
                  <td className="px-6 py-3 border-b">{resultado.titulo_examen}</td>
                  <td className="px-6 py-3 border-b">{resultado.calificacion}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="p-6 text-center text-gray-700">
            No hay resultados registrados para este estudiante.
          </div>
        )}
      </div>

      <div className="mt-8 text-center">
        <button
          onClick={handleGoBack}
          className="bg-blue-600 hover:bg-blue-700 transition-colors text-white font-medium px-6 py-2 rounded-lg shadow"
        >
          Regresar
        </button>
      </div>
    </div>
  )
}
