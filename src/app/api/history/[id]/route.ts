import { NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';
import { useUser } from '@/app/context/UserContext'; 

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const historyId = parseInt(params.id, 10);

  if (isNaN(historyId)) {
    return NextResponse.json({ message: 'El ID del historial no es válido.' }, { status: 400 });
  }

  try {
    const entryExists = await prisma.historial.findUnique({
      where: { id: historyId },
    });

    if (!entryExists) {
      return NextResponse.json({ message: 'La entrada del historial no fue encontrada.' }, { status: 404 });
    }
    await prisma.historial.delete({
      where: {
        id: historyId,
      },
    });

    return new NextResponse(null, { status: 204 });

  } catch (error) {
    console.error(`❌ ERROR AL ELIMINAR HISTORIAL (ID: ${historyId}):`, error);
    return NextResponse.json({ 
        message: 'Error al eliminar la entrada del historial.',
        // @ts-ignore
        errorDetails: error.message 
    }, { status: 500 });
  }
}