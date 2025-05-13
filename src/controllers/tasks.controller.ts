import { Request, Response, NextFunction, RequestHandler } from 'express';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();
const JWT_SECRET = 'tu_clave_secreta';


// ================== MIDDLEWARE ==================
export const authMiddleware: RequestHandler = (
  req: Request, 
  res: Response, 
  next: NextFunction
) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    res.status(401).json({ error: "Acceso no autorizado" });
    return;
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    res.locals.userId = decoded.userId; // Usar res.locals en lugar de req
    next();
  } catch (error) {
    res.status(401).json({ error: "Token inválido" });
  }
};

// ================== CONTROLADORES ==================
// Obtener tareas del usuario
export const getTasks = async (req: Request, res: Response) => {
  try {
    const tasks = await prisma.task.findMany({
      where: { userId: res.locals.userId }, // Cambiado a res.locals
    });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener tareas" });
  }
};

// Crear tarea
export const createTask = async (req: Request, res: Response) => {
  const { title } = req.body;
  try {
    const task = await prisma.task.create({
      data: { 
        title,
        completed: false,
        userId: res.locals.userId, 
      },
    });
    res.json(task);
  } catch (error) {
    res.status(500).json({ error: "Error al crear tarea" });
  }
};

// Actualizar tarea
export const updateTask = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { completed, title } = req.body;
  try {
    const task = await prisma.task.update({
      where: { id },
      data: { completed, title },
    });
    res.json(task);
  } catch (error) {
    res.status(500).json({ error: "Error al actualizar tarea" });
  }
};

// Eliminar tarea
export const deleteTask = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    await prisma.task.delete({ where: { id } });
    res.json({ message: "Tarea eliminada" });
  } catch (error) {
    res.status(500).json({ error: "Error al eliminar tarea" });
  }
};