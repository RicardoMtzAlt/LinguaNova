// ===============================
// src/app/api/auth/login/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma'; 

export async function POST(request: Request) {
  const { correo, contrasena } = await request.json();

  if (!correo || !contrasena) {
    return NextResponse.json({ message: 'Correo y contraseña requeridos' }, { status: 400 });
  }

  const usuario = await prisma.usuario.findUnique({
    where: { correo },
  });

  if (!usuario || usuario.contrasena !== contrasena) {
    return NextResponse.json({ message: 'Credenciales inválidas' }, { status: 401 });
  }

  return NextResponse.json({ message: 'Login exitoso', usuario: { id: usuario.id, rol: usuario.rol } });
}
