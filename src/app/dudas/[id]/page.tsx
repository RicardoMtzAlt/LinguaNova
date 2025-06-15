'use client';

import { useState, useEffect, FormEvent } from 'react';
import { useUser } from '@/app/context/UserContext';
import { useRouter } from 'next/navigation';
import { historial } from '@prisma/client';

export default function TranslatePage() {
  const { user, isLoading: isUserLoading } = useUser();
  const router = useRouter();

  const [phrase, setPhrase] = useState('');
  const [isTranslating, setIsTranslating] = useState(false);
  const [history, setHistory] = useState<historial[]>([]); 
  const [error, setError] = useState('');

  const [deletingId, setDeletingId] = useState<number | null>(null);

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push('/login');
    }
  }, [user, isUserLoading, router]);

  useEffect(() => {
    const fetchHistory = async () => {
      if (user?.id) {
        try {
          const res = await fetch(`/api/history?userId=${user.id}`);
          if (!res.ok) throw new Error('No se pudo cargar el historial.');
          const data: historial[] = await res.json();
          setHistory(data);
        } catch (err) {
          setError(err instanceof Error ? err.message : 'Error desconocido');
        }
      }
    };
    
    fetchHistory();
  }, [user]); 

  const handleTranslate = async (e: FormEvent) => {
    e.preventDefault();
    if (!phrase.trim() || !user) return;

    setIsTranslating(true);
    setError('');

    try {
      const res = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phrase, userId: user.id }),
      });
      
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Error en la traducción.');
      }

      const newEntry: historial = await res.json();
      
      setHistory(prevHistory => [newEntry, ...prevHistory]);
      setPhrase(''); 

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setIsTranslating(false);
    }
  };

  const handleDeleteHistory = async (id: number) => {

    setDeletingId(id); 
    setError('');

    try {
      const res = await fetch(`/api/history/${id}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        const errorData = res.status !== 204 ? await res.json() : null;
        throw new Error(errorData?.message || 'No se pudo eliminar la entrada.');
      }
      
      setHistory(prevHistory => prevHistory.filter(item => item.id !== id));

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido al eliminar.');
    } finally {
      setDeletingId(null);
    }
  };

  if (isUserLoading) {
    return <p className="text-center mt-10">Cargando</p>;
  }

  return (
    <div className="container mx-auto p-4 md:p-8 max-w-4xl">
      
      <form onSubmit={handleTranslate} className="mb-8 p-6 bg-white rounded-lg shadow-md">
        <label htmlFor="phrase" className="block text-lg font-medium text-gray-700">
          Frase a traducir al español
        </label>
        <div className="mt-2 flex flex-col sm:flex-row gap-2">
          <input
            id="phrase"
            type="text"
            className="flex-grow p-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-black placeholder-gray"
            placeholder="E.g., ''You rely on wit, and people die on it'' or ''三冠王者よ、万歳！''"
            value={phrase}
            onChange={(e) => setPhrase(e.target.value)}
            disabled={isTranslating}
          />
          <button
            type="submit"
            className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-md shadow-sm hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
            disabled={!phrase.trim() || isTranslating}
          >
            {isTranslating ? 'Traduciendo...' : 'Traducir'}
          </button>
        </div>
        {error && <p className="mt-2 text-red-600">{error}</p>}
      </form>

     <div>
        <h2 className="text-2xl font-bold mb-4">Tu Historial de Búsquedas</h2>
        {history.length > 0 ? (
          <ul className="space-y-4">
            {history.map((item) => (
              <li key={item.id} className="p-4 bg-gray-50 rounded-lg border border-gray-200 relative group">
              {/* Botón de eliminar */}
              <button
                onClick={() => handleDeleteHistory(item.id)}
                disabled={deletingId === item.id}
                className="absolute top-2 right-2 p-1.5 bg-gray-200 rounded-full text-gray-600 hover:bg-red-200 hover:text-red-700 opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-50"
                aria-label="Eliminar entrada"
              >
                {deletingId === item.id ? (
                  <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                )}
              </button>
              
              <p className="text-sm text-gray-500">Búsqueda:</p>
              <p className="font-semibold text-gray-800">{item.busqueda}</p>
              <p className="mt-2 text-sm text-gray-500">Traducción:</p>
              <p className="text-lg text-blue-800">{item.respuesta}</p> 
               <p className="mt-2 text-xs text-gray-400 text-right">
                  {new Date(item.fecha).toLocaleString()}
              </p>
            </li>
            ))}
          </ul>
        ) : (
          <p className="text-center text-gray-500 py-8">
            No existen búsquedas en tu historial. ¡Pregunta lo que necesites!
          </p>
        )}
      </div>
    </div>
  );
}