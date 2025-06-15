// src/app/api/auth/login/route.ts
import { NextResponse } from 'next/server'
import prisma from '@/app/lib/prisma'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'clave-secreta'

export async function POST(request: Request) {
  try {
    const { correo, contrasena } = await request.json()

    if (!correo || !contrasena) {
      return NextResponse.json({ message: 'Correo y contraseña requeridos' }, { status: 400 })
    }

    const usuario = await prisma.usuarios.findUnique({
      where: { correo },
    })

    if (!usuario || usuario.contrasena !== contrasena) {
      return NextResponse.json({ message: 'Credenciales inválidas' }, { status: 401 })
    }

    // ✅ Generar JWT
    const token = jwt.sign({ id: usuario.id }, JWT_SECRET, {
      expiresIn: '7d', // o el tiempo que tú decidas
    })

    // ✅ Guardar cookie HTTP Only
    const response = NextResponse.json({
      message: 'Login exitoso',
      usuario: {
        id: usuario.id,
        nombre: usuario.nombre,
        correo: usuario.correo,
      },
    })

    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 días
    })

    return response
  } catch (error) {
    console.error('Error en login:', error)
    return NextResponse.json({ message: 'Error del servidor' }, { status: 500 })
  }
}
