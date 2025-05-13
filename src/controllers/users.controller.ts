import { NextFunction, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { User, AuthResponse } from '../interfaces/user.interface';

const prisma = new PrismaClient();
const JWT_SECRET = 'tu_clave_secreta'; // Usa una variable de entorno en producción

// Registrar usuario
export const register = async (req: Request, res: Response) => {
  const { email, password }: User = req.body;
  
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { email, password: hashedPassword },
    });
    
    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '1h' });
    res.json({ token, user: { id: user.id, email: user.email } } as AuthResponse);
  } catch (error) {
    res.status(500).json({ error: "Error al registrar usuario" });
  }
};

// Login usuario
export const login = async (req: Request, res: Response,): Promise<void> => {
  const { email, password }: User = req.body;
  
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      res.status(401).json({ error: "Credenciales inválidas" });
      return;
    }
    
    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '1h' });
    res.json({ token, user: { id: user.id, email: user.email } } as AuthResponse);
  } catch (error) {
    res.status(500).json({ error: "Error al iniciar sesión" });
  }
};
