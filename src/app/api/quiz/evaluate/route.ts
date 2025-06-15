import { NextResponse } from 'next/server';
import { model } from '@/app/lib/gemini';

export async function POST(request: Request) {
  try {
    const { question, answer } = await request.json();

    if (!question || !answer) {
      return NextResponse.json({ message: 'Se requiere la pregunta y la respuesta' }, { status: 400 });
    }

    const prompt = `
      Evalúa si la respuesta del usuario es correcta para la siguiente pregunta.
      Pregunta: "${question}"
      Respuesta del usuario: "${answer}"

      Considera sinónimos y variaciones menores, pero sé estricto con el concepto principal.
      Tu respuesta debe ser EXCLUSIVAMENTE un objeto JSON con la siguiente estructura y debe ser en el idioma de la pregunta:
      {
        "isCorrect": boolean,
        "explanation": "Una breve explicación de por qué la respuesta es correcta o incorrecta. Si es incorrecta, menciona cuál sería la respuesta correcta."
      }
      Ejemplo si la respuesta es correcta:
      {
        "isCorrect": true,
        "explanation": "¡Correcto! Júpiter es el planeta más grande del Sistema Solar."
      }
      Ejemplo si la respuesta es incorrecta:
      {
        "isCorrect": false,
        "explanation": "Incorrecto. La respuesta correcta es Júpiter. Marte es conocido como el 'Planeta Rojo'."
      }
    `;
    
    const result = await model.generateContent(prompt);
    let responseText = await result.response.text();
    
    console.log(`Evaluación de Gemini para "${answer}":`, responseText);
    
    const cleanedResponse = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
    const evaluation = JSON.parse(cleanedResponse);

    return NextResponse.json(evaluation);

  } catch (error) {
    console.error("❌ ERROR AL EVALUAR LA RESPUESTA:", error);
    return NextResponse.json({ 
        message: 'Error al evaluar la respuesta.',
        // @ts-ignore
        errorDetails: error.message 
    }, { status: 500 });
  }
}