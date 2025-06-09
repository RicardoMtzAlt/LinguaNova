import prisma from '@/app/lib/prisma'
import { notFound } from 'next/navigation'
import Resultados from './Calificaciones'


export default async function UsuariosPage() {
  const usuarios = await prisma.usuario.findMany()
  const resultados = await prisma.resultado.findMany()
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4"></h1>
      { <Resultados usuarios={usuarios} resultados={resultados} /> }
    </div>
  )
}