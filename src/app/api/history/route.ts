import { NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');

  if (!userId) {
    return NextResponse.json({ message: 'El ID de usuario es requerido' }, { status: 400 });
  }

  try {
    const userHistory = await prisma.historial.findMany({
      where: {
        usuarioid: Number(userId),
      },
      orderBy: {
        fecha: 'desc', 
            },
    });

    return NextResponse.json(userHistory);

  } catch (error) {
    console.error("❌ ERROR AL OBTENER HISTORIAL:", error);
    return NextResponse.json({ 
        message: 'Error al obtener el historial del usuario.',
        // @ts-ignore
        errorDetails: error.message
    }, { status: 500 });
  }
}