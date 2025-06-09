// src/app/usuarios/page.tsx
import prisma from '@/app/lib/prisma'
import Link from 'next/link'
import UserList from './UserList'

export default async function UsuariosPage() {
  const usuarios = await prisma.usuario.findMany()

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="w-full max-w-5xl bg-white rounded-xl shadow-lg p-8">
        <div className="flex items-center justify-between mb-6"></div>

        <h1 className="text-3xl font-bold mb-2 text-center text-blue-700">Gestión de Usuarios</h1>
        <h2 className="text-xl font-semibold mb-6 text-center text-blue-600">Usuarios Registrados</h2>

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
    </div>
  )
}
