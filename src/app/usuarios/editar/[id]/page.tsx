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
    <div className="p-6 max-w-xl mx-auto">
      <div className="bg-white shadow-md rounded-lg p-6">
        <h1 className="text-3xl font-bold text-center text-blue-700 mb-4">Editar Usuario</h1>
        <FormularioUsuario usuario={usuario} />
        <div className="mt-6 text-center">
          <Link
            href="/usuarios"
            className="text-blue-600 hover:underline"
          >
            ← Volver a la lista de usuarios
          </Link>
        </div>
      </div>
    </div>
  )
}
