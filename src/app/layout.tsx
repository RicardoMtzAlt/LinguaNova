// ===============================
// src/app/layout.tsx
"use client";

import { ReactNode } from "react";
import "@/app/globals.css";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es">
      <body>
        <main className="p-4 max-w-4xl mx-auto">{children}</main>
      </body>
    </html>
  );
}