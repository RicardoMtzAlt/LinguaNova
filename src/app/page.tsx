// ===============================
// src/app/page.tsx
import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-100 to-blue-200">
      <div className="bg-white shadow-xl rounded-lg p-10 max-w-xl w-full text-center">
        <h1 className="text-4xl font-extrabold text-gray-800 mb-6">
          🎓 Bienvenido al Sistema de Evaluación
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          Gestiona exámenes, usuarios y resultados de forma eficiente y segura.
        </p>
        <Link
          href="/login"
          className="inline-block bg-blue-400 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg transition duration-200 text-lg"
        >
          Iniciar Sesión
        </Link>
      </div>
    </div>
  )
}
