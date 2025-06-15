import prisma from '@/app/lib/prisma'
import { notFound, redirect } from 'next/navigation'
import FormularioUsuario from './Formulario'
import { getCurrentUser } from '@/app/lib/usuarios' 
import Link from 'next/link'

export default async function EditarUsuarioPage({ params }: { params: { id: string } }) {
  const usuarioLogueado = await getCurrentUser()
  const id = Number(params.id)

  if (!usuarioLogueado || usuarioLogueado.id !== id) {
    redirect('/') 
  }

  const usuario = await prisma.usuarios.findUnique({
    where: { id }
  })

  if (!usuario) return notFound()

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="w-full max-w-xl bg-white shadow-lg rounded-xl p-8">
        <h1 className="text-3xl font-bold text-center text-blue-700 mb-6">
          Editar Perfil
        </h1>

        <FormularioUsuario usuario={usuario} />

        <div className="mt-8 text-center">
          <Link
            href="/dashboard"
            className="text-blue-600 hover:underline font-medium"
          >
            ← Volver al panel
          </Link>
        </div>
      </div>
    </div>
  )
}
