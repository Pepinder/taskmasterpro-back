import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';  
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { User, AuthResponse } from '../interfaces/user.interface';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'tu_clave_secreta_por_defecto'; // Asegúrate de definir esto en tu archivo .env

// --- Registrar usuario ---
export const register = async (req: Request, res: Response) => {
  const { email, password }: User = req.body;
  
  try {
    // Verificar si el usuario ya existe
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ error: "El correo electrónico ya está registrado." }); // 409 Conflict
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { email, password: hashedPassword },
    });
    
    // Crear el token DESPUÉS de crear el usuario
    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '1h' });
    
    res.status(201).json({ token, user: { id: user.id, email: user.email } } as AuthResponse);
  } catch (error) {
    console.error("Error en register:", error);
    res.status(500).json({ error: "Error al registrar usuario" });
  }
};

// --- Login usuario ---
export const login = async (req: Request, res: Response) => {
  const { email, password }: User = req.body;
  
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: "Credenciales inválidas" });
    }
    
    // Crear el token DESPUÉS de verificar las credenciales
    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '1h' });

    res.json({ token, user: { id: user.id, email: user.email } } as AuthResponse);
  } catch (error) {
    console.error("Error en login:", error);
    res.status(500).json({ error: "Error al iniciar sesión" });
  }
};
