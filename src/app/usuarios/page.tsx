// src/app/usuarios/page.tsx
import prisma from '@/app/lib/prisma'
import Link from 'next/link'
import UserList from './UserList'

export default async function UsuariosPage() {
  const usuarios = await prisma.usuario.findMany()
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Usuarios</h1>
      <Link href="/usuarios/nuevo" className="text-blue-500 underline">Nuevo Usuario</Link>
      <UserList usuarios={usuarios} />
    </div>
  )
}
