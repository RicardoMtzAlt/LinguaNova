// src/app/lib/usuarios.ts
import { prisma } from './prisma';
import { cookies } from 'next/headers'
import jwt from 'jsonwebtoken'

const SECRET_KEY = process.env.JWT_SECRET || 'clave-secreta'

export async function getCurrentUser() {
  const cookieStore = cookies()
  const token = (await cookieStore).get('token')?.value

  if (!token) return null

  try {
    const decoded = jwt.verify(token, SECRET_KEY) as { id: number }

    const user = await prisma.usuarios.findUnique({
      where: { id: decoded.id },
      select: {
        id: true,
        nombre: true,
        correo: true,
      },
    })

    return user
  } catch (err) {
    return null
  }
}

export async function getUsuarios() {
  return await prisma.usuarios.findMany();
}

export async function getUsuarioPorId(id: number) {
  return await prisma.usuarios.findUnique({ where: { id } });
}
