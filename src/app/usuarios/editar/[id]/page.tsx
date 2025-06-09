import prisma from '@/app/lib/prisma'
import { notFound } from 'next/navigation'
import FormularioUsuario from './Formulario'
import Link from 'next/link'

export default async function EditarUsuarioPage({ params }: { params: { id: string } }) {
  const usuario = await prisma.usuario.findUnique({
    where: { id: Number(params.id) }
  })

  if (!usuario) return notFound()

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="w-full max-w-xl bg-white shadow-lg rounded-xl p-8">
        <h1 className="text-3xl font-bold text-center text-blue-700 mb-6">
          Editar Usuario
        </h1>

        <FormularioUsuario usuario={usuario} />

        <div className="mt-8 text-center">
          <Link
            href="/usuarios"
            className="text-blue-600 hover:underline font-medium"
          >
            ← Volver a la lista de usuarios
          </Link>
        </div>
      </div>
    </div>
  )
}
