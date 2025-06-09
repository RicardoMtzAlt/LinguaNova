'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useUser } from '../context/UserContext';
import { useEffect } from 'react';

const temas = ['Historia', 'Biologia', 'Matematicas', 'Geografia'];

export default function DashboardPage() {
  const { user, isLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
    // Redirección para el profesor
    if (user?.rol === 'PROFESOR') {
      router.push('/resultados');
    }
  }, [user, isLoading, router]);

  if (isLoading || !user || user.rol !== 'ESTUDIANTE') {
    return <p className="text-center mt-10">Cargando...</p>;
  }

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-4">Bienvenido</h1>
      <Link className="text-green-500 cursor-pointer" href={`/resultados/alumnos/${user.id}`}>
        Ver resultados anteriores
      </Link>
      <p className="text-xl mb-8">Selecciona un tema para comenzar el cuestionario:</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {temas.map((tema) => (
          <Link
            key={tema}
            href={`/quiz/${tema.toLowerCase()}`}
            className="bg-blue-600 text-white text-center font-bold py-4 px-6 rounded-lg hover:bg-blue-700 transition-colors"
          >
            {tema}
          </Link>
        ))}
      </div>
    </div>
  );
}