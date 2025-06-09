import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { UserProvider } from './context/UserContext'; // Importa el provider

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Proyecto de Cuestionarios',
  description: 'Generado con Next.js y Gemini',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <UserProvider> {/* Envuelve tu app con el provider */}
          {children}
        </UserProvider>
      </body>
    </html>
  );
}