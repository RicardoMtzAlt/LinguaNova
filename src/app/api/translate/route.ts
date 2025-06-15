import { NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';
import { model } from '@/app/lib/gemini';

export async function POST(request: Request) {
  try {
    const { phrase, userId } = await request.json();

    if (!phrase || !userId) {
      return NextResponse.json({ message: 'Se requiere la frase y el ID de usuario' }, { status: 400 });
    }

    const prompt = `
      Traduce la siguiente frase al español.
      Frase: "${phrase}"
      
      Responde únicamente con la traducción directa y el idioma del que se traduce, sin texto adicional, explicaciones o comillas.
      Si la traduccion directa no tiene sentido en español traducela a un modo en el que sea comprensible
      Por ejemplo, si la frase es "Hello, world", tu respuesta debe ser solo "Del ingles al español: Hola, mundo".
      o por ejemplo si la frase es "U are beautiful", tu respuesta debe ser un "Del ingles al español: Eres hermosa"
    `;

    const result = await model.generateContent(prompt);
    const translation = await result.response.text();


    const newHistoryEntry = await prisma.historial.create({
      data: {
        busqueda: phrase,
        respuesta: translation,
        usuarioid: Number(userId),
      },
    });

    return NextResponse.json(newHistoryEntry, { status: 201 });

  } catch (error) {
    console.error(" ERROR EN LA API DE TRADUCCIÓN:", error);
    return NextResponse.json({ 
        message: 'Error al traducir o guardar en el historial.',
        // @ts-ignore
        errorDetails: error.message 
    }, { status: 500 });
  }
}