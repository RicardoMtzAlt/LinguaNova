import prisma from '@/app/lib/prisma'
import Resultados from './Calificaciones'

export default async function UsuariosPage() {
  const usuarios = await prisma.usuarios.findMany()
  const resultados = await prisma.resultados.findMany()

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800 p-6">
      <div className="w-full max-w-6xl bg-gray-800 text-gray-100 rounded-xl shadow-2xl overflow-hidden p-8">
        <h1 className="text-3xl font-bold text-indigo-200 mb-8 text-center">
          📊 Calificaciones Generales
        </h1>
        <Resultados usuarios={usuarios} resultados={resultados} />
      </div>
    </div>
  )
}
