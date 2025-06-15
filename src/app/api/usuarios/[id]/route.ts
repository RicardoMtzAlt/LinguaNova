import prisma from '@/app/lib/prisma';
import { NextResponse } from 'next/server';

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const data = await request.json();
    const id = Number(params.id);

    const usuarioActual = await prisma.usuarios.findUnique({
      where: { id },
    });

    if (!usuarioActual) {
      return new NextResponse('Usuario no encontrado', { status: 404 });
    }

    const contrasenaActualizada =
      data.contrasena && data.contrasena.trim() !== ''
        ? data.contrasena
        : usuarioActual.contrasena;

    const usuario = await prisma.usuarios.update({
      where: { id },
      data: {
        nombre: data.nombre,
        correo: data.correo,
        contrasena: contrasenaActualizada,
      },
    });

    return NextResponse.json(usuario);
  } catch (error) {
    return new NextResponse('Error al actualizar el usuario', { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = Number(params.id);

    const usuario = await prisma.usuarios.delete({
      where: { id },
    });

    console.log('Usuario eliminado:', usuario);

    return NextResponse.json({ message: 'Usuario eliminado' });
  } catch (error) {
    console.error('Error eliminando usuario:', error);

    return NextResponse.json(
      { error: 'No se pudo eliminar', detalle: error },
      { status: 500 }
    );
  }
}