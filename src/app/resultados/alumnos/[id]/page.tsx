import prisma from '@/app/lib/prisma'
import Resultados from './Calificaciones'

export default async function UsuariosPage() {
  const usuarios = await prisma.usuario.findMany()
  const resultados = await prisma.resultado.findMany()

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="w-full max-w-6xl bg-white rounded-xl shadow-lg overflow-hidden p-6">
        <h1 className="text-2xl font-bold text-indigo-700 mb-6 text-center">Calificaciones</h1>
        <Resultados usuarios={usuarios} resultados={resultados} />
      </div>
    </div>
  )
}
