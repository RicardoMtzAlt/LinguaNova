import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { UserProvider } from './context/UserContext'; 

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'simulador lenguajes',
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
        <UserProvider> 
          {children}
        </UserProvider>
      </body>
    </html>
  );
}