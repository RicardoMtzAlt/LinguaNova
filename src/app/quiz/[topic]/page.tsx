'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useUser } from '@/app/context/UserContext';

type Evaluation = {
  isCorrect: boolean;
  explanation: string;
};

export default function QuizPage() {
  const { topic } = useParams();
  const router = useRouter();
  const { user } = useUser();

  const [questions, setQuestions] = useState<string[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evaluationResult, setEvaluationResult] = useState<Evaluation | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    if (!topic || !user) return;

    const fetchQuestions = async () => {
      setIsLoading(true);
      try {
        const res = await fetch('/api/quiz/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ topic }),
        });

        if (!res.ok) throw new Error('Error al generar preguntas');
        const data: string[] = await res.json();
        setQuestions(data);
      } catch (error) {
        console.error(error);
        alert('No se pudieron cargar las preguntas.');
        router.push('/dashboard');
      } finally {
        setIsLoading(false);
      }
    };

    fetchQuestions();
  }, [topic, user, router]);

  const handleAnswerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userAnswer.trim() || isEvaluating) return;

    setIsEvaluating(true);
    setEvaluationResult(null);

    try {
      const res = await fetch('/api/quiz/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: questions[currentQuestionIndex],
          answer: userAnswer,
        }),
      });

      if (!res.ok) throw new Error('Error al evaluar');

      const data: Evaluation = await res.json();
      setEvaluationResult(data);
      if (data.isCorrect) setScore(prev => prev + 1);
    } catch (error) {
      console.error(error);
      alert('Hubo un error al evaluar tu respuesta.');
    } finally {
      setIsEvaluating(false);
    }
  };

  const saveResult = async () => {
    if (!user) return;
    try {
      await fetch('/api/results/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: topic.toString(),
          score,
          userId: user.id,
        }),
      });
    } catch (error) {
      console.error('Error al guardar:', error);
    }
  };

  const handleNextQuestion = async () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setUserAnswer('');
      setEvaluationResult(null);
    } else {
      await saveResult();
      setIsFinished(true);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-6 max-w-md w-full">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mx-auto mb-4" />
          <p className="text-gray-700 text-lg font-medium">Generando tu cuestionario con IA...</p>
        </div>
      </div>
    );
  }

  if (!questions.length) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-6 max-w-md w-full">
          <p className="text-gray-700">No hay preguntas disponibles.</p>
        </div>
      </div>
    );
  }

  if (isFinished) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <div className="w-full max-w-md bg-white rounded-xl shadow-lg overflow-hidden p-6 text-center">
          <div className="mb-6">
            <svg className="w-16 h-16 text-green-500 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">¡Cuestionario Terminado!</h2>
          <p className="text-lg text-gray-600 mb-6">
            Tu puntuación: <span className="font-bold text-indigo-600">{score} de {questions.length}</span>
          </p>
          <button
            onClick={() => router.push('/dashboard')}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-lg transition duration-200"
          >
            Volver al inicio
          </button>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6">
          <div className="p-6 bg-indigo-600 text-white">
            <h1 className="text-2xl font-bold mb-1">Cuestionario de: <span className="capitalize">{topic.toString()}</span></h1>
            <p className="text-indigo-100">Pregunta {currentQuestionIndex + 1} de {questions.length} | Puntuación: {score}</p>
          </div>

          <div className="p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">{currentQuestion}</h2>

            <form onSubmit={handleAnswerSubmit}>
              <textarea
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-800 placeholder-gray-400"
                rows={4}
                placeholder="Escribe tu respuesta aquí..."
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                disabled={!!evaluationResult || isEvaluating}
              />
              <button
                type="submit"
                className={`w-full mt-4 py-3 px-4 rounded-lg font-bold transition duration-200 text-white ${
                  evaluationResult
                    ? evaluationResult.isCorrect
                      ? 'bg-green-600 hover:bg-green-700'
                      : 'bg-red-600 hover:bg-red-700'
                    : 'bg-indigo-600 hover:bg-indigo-700'
                } ${(!userAnswer.trim() || !!evaluationResult || isEvaluating) ? 'opacity-50 cursor-not-allowed' : ''}`}
                disabled={!userAnswer.trim() || !!evaluationResult || isEvaluating}
              >
                {isEvaluating ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Evaluando...
                  </span>
                ) : (
                  'Revisar mi respuesta'
                )}
              </button>
            </form>

            {evaluationResult && (
              <div className={`mt-4 p-4 rounded-lg border ${
                evaluationResult.isCorrect ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
              }`}>
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    {evaluationResult.isCorrect ? (
                      <svg className="h-5 w-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      <svg className="h-5 w-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    )}
                  </div>
                  <div className="ml-3">
                    <h3 className={`text-sm font-medium ${
                      evaluationResult.isCorrect ? 'text-green-800' : 'text-red-800'
                    }`}>
                      {evaluationResult.isCorrect ? '¡Respuesta Correcta!' : 'Respuesta Incorrecta'}
                    </h3>
                    <p className={`mt-2 text-sm ${
                      evaluationResult.isCorrect ? 'text-green-700' : 'text-red-700'
                    }`}>
                      {evaluationResult.explanation}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {evaluationResult && (
          <button
            onClick={handleNextQuestion}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-lg transition duration-200"
          >
            {currentQuestionIndex < questions.length - 1 ? 'Siguiente Pregunta →' : 'Finalizar Cuestionario'}
          </button>
        )}
      </div>
    </div>
  );
}
