import { NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';

export async function POST(request: Request) {
  try {
    const { topic, score, userId } = await request.json();

    if (!topic || score === undefined || !userId) {
      return NextResponse.json({ message: 'Tema, puntuación y ID de usuario son requeridos' }, { status: 400 });
    }

    const newResult = await prisma.resultado.create({
      data: {
        titulo_examen: topic,
        calificacion: score,
        estudiante_id: Number(userId),
      },
    });

    return NextResponse.json(newResult, { status: 201 });

  } catch (error) {
    console.error("Error al guardar el resultado:", error);
    return NextResponse.json({ message: 'Error al guardar el resultado' }, { status: 500 });
  }
}