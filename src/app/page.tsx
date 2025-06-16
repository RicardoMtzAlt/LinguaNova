
import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800">
      <div className="bg-gray-800 shadow-xl rounded-lg p-10 max-w-xl w-full text-center">
        <h1 className="text-4xl font-extrabold text-indigo-200 mb-6">
          🌍 Bienvenido a <span className="text-white">LinguaNova</span>
        </h1>
        <p className="text-lg text-gray-300 mb-4 italic">
          "Tu pasaporte al mundo empieza con una palabra."
        </p>
        <p className="text-md text-gray-400 mb-8">
          Aprende múltiples idiomas de forma práctica, divertida y conectada.
        </p>
        <div className="text-gray-400 mb-6">
          <p className="mb-2">📚 “Con cada idioma, una nueva forma de ver el mundo.”</p>
          <p>🤝 “Aquí los acentos no dividen, ¡nos unen!”</p>
        </div>
        <Link
          href="/login"
          className="inline-block bg-indigo-600 hover:bg-indigo-400 text-white font-semibold px-6 py-3 rounded-lg transition duration-200 text-lg"
        >
          Iniciar Sesión
        </Link>
      </div>
    </div>
  )
}