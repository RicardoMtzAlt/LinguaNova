import prisma from '@/app/lib/prisma'
import { notFound } from 'next/navigation'
import FormularioUsuario from './Formulario'

export default async function EditarUsuarioPage({ params }: { params: { id: string } }) {
  const usuario = await prisma.usuario.findUnique({
    where: { id: Number(params.id) }
  })

  if (!usuario) return notFound()

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Editar Usuario</h1>
      <FormularioUsuario usuario={usuario} />
    </div>
  )
}
