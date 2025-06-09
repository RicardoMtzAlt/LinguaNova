// src/app/usuarios/page.tsx
import prisma from '@/app/lib/prisma'
import Link from 'next/link'
import UserList from './UserList'

export default async function UsuariosPage() {
  const usuarios = await prisma.usuario.findMany()

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6"></div>

      <h1 className="text-3xl font-bold mb-6 text-center text-blue-700">Gestión de Usuarios</h1>
      <h1 className="text-3xl font-bold text-center text-blue-700">Usuarios Registrados</h1>

      <UserList usuarios={usuarios} />

      {/* Botón centrado */}
      <div className="mt-6 flex justify-center">
        <Link
          href="/usuarios/nuevo"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow text-sm"
        >
          + Nuevo Usuario
        </Link>
      </div>
    </div>
  )
}
