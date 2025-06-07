// src/app/lib/usuarios.ts
import { prisma } from './prisma';

export async function getUsuarios() {
  return await prisma.usuario.findMany();
}

export async function getUsuarioPorId(id: number) {
  return await prisma.usuario.findUnique({ where: { id } });
}
