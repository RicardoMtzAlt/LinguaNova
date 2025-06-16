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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800 p-6">
      <div className="w-full max-w-xl bg-gray-800 shadow-2xl rounded-xl p-8">
        <h1 className="text-3xl font-extrabold text-center text-indigo-200 mb-6">
          ✏️ Edita tu perfil
        </h1>

        <p className="text-sm text-gray-400 text-center mb-6 italic">
          “Tu identidad lingüística, ahora con tu mejor versión”
        </p>

        <FormularioUsuario usuario={usuario} />

        <div className="mt-8 text-center">
          <Link
            href="/dashboard"
            className="text-indigo-400 hover:text-indigo-300 font-medium underline"
          >
            ← Volver al panel
          </Link>
        </div>
      </div>
    </div>
  )
}
