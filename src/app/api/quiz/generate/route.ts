import { NextResponse } from 'next/server';
import { model } from '@/app/lib/gemini';

export async function POST(request: Request) {
  try {
    const { topic } = await request.json();
    if (!topic) {
      return NextResponse.json({ message: 'El tema es requerido' }, { status: 400 });
    }

    const prompt = `
      Genera 10 preguntas de conocimiento abiertas y concisas sobre el idioma "${topic}" en este idioma.
      Las preguntas deben requerir una respuesta corta y específica.
      Devuelve la respuesta EXCLUSIVAMENTE en formato de array de strings JSON.
      Ejemplo para el tema "Ingles":
      ["How do you write "altura" in english?"]
      No incluyas nada más en tu respuesta, solo el array JSON.
    `;

    const result = await model.generateContent(prompt);
    let responseText = await result.response.text();

    console.log("Respuesta RAW de Gemini (preguntas abiertas):", responseText);
    
    const cleanedResponse = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
    const questions = JSON.parse(cleanedResponse);

    return NextResponse.json(questions);

  } catch (error) {
    console.error("❌ ERROR AL GENERAR PREGUNTAS ABIERTAS:", error);
    return NextResponse.json({ 
        message: 'Error al generar preguntas abiertas.',
        // @ts-ignore
        errorDetails: error.message 
    }, { status: 500 });
  }
}