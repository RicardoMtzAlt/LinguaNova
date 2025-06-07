import { NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { nombre, correo, rol, contrasena } = body;

    if (!nombre || !correo || !rol || !contrasena) {
      return NextResponse.json(
        { message: "Faltan campos requeridos." },
        { status: 400 }
      );
    }

    const nuevoUsuario = await prisma.usuario.create({
      data: { nombre, correo, rol, contrasena },
    });

    return NextResponse.json(nuevoUsuario, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Error al crear usuario." },
      { status: 500 }
    );
  }
}
