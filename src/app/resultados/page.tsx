import prisma from '@/app/lib/prisma'
import Link from 'next/link'
import Resultados from './alumnos'


export default async function UsuariosPage() {
  const usuarios = await prisma.usuario.findMany()
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4"></h1>
      <Resultados usuarios={usuarios} />
    </div>
  )
}
