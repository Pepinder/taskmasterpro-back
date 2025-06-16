import { RequestHandler } from 'express'; // <-- Importa RequestHandler
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// ================== CONTROLADORES CORREGIDOS ==================

export const getTasks: RequestHandler = async (req, res) => {
  const userId = req.user!.id;
  const { status, sortBy = 'createdAt', order = 'desc' } = req.query as { status?: string, sortBy?: string, order?: 'asc' | 'desc' };

  try {
    const where: any = { userId };
    if (status === 'completed') where.completed = true;
    if (status === 'pending') where.completed = false;

    const orderBy: any = {};
    if (sortBy === 'title') {
      orderBy.title = order;
    } else {
      orderBy.createdAt = order;
    }

    const tasks = await prisma.task.findMany({ where, orderBy });
    res.json(tasks);
  } catch (error) {
    // Es buena práctica loguear el error en el servidor
    console.error("Error en getTasks:", error);
    res.status(500).json({ message: 'Error al obtener tareas' });
  }
};

export const createTask: RequestHandler = async (req, res) => {
  const { title } = req.body;
  const userId = req.user!.id;

  if (!title) {
    res.status(400).json({ message: 'El título es requerido' }); // Envia la respuesta
    return; // Termina la ejecución de la función
  }

  try {
    const newTask = await prisma.task.create({
      data: {
        title,
        userId,
      },
    });
    res.status(201).json(newTask);
  } catch (error) {
    console.error("Error en createTask:", error);
    res.status(500).json({ message: 'Error al crear la tarea' });
  }
};

export const updateTask: RequestHandler = async (req, res) => {
  const userId = req.user!.id;
  const { id } = req.params;
  const { title, completed } = req.body;

  try {
    const taskToUpdate = await prisma.task.findFirst({
        where: { id, userId }
    });

    if (!taskToUpdate) {
        res.status(404).json({ message: 'Tarea no encontrada o no tienes permiso para editarla' });
        return ; // Termina la ejecución si no se encuentra la tarea
    }

    const updatedTask = await prisma.task.update({
      where: { id },
      data: { title, completed },
    });

    res.json(updatedTask);
  } catch (error) {
    console.error("Error en updateTask:", error);
    res.status(500).json({ message: 'Error al actualizar la tarea' });
  }
};

export const deleteTask: RequestHandler = async (req, res) => {
  const userId = req.user!.id;
  const { id } = req.params;

  try {
    const taskToDelete = await prisma.task.findFirst({
        where: { id, userId }
    });

    if (!taskToDelete) {
        res.status(404).json({ message: 'Tarea no encontrada o no tienes permiso para eliminarla' });
        return; // Termina la ejecución si no se encuentra la tarea
    }

    await prisma.task.delete({
      where: { id },
    });

    res.status(204).send();
  } catch (error) {
    console.error("Error en deleteTask:", error);
    res.status(500).json({ message: 'Error al eliminar la tarea' });
  }
};