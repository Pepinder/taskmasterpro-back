import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// ¡MUY IMPORTANTE! Mueve esto a tu archivo .env
// En .env -> JWT_SECRET="tu_secreto_super_seguro_y_largo"
const JWT_SECRET = process.env.JWT_SECRET ||'tu_clave_secreta_por_defecto';

// Extendemos la interfaz Request de Express para que TypeScript conozca req.user
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
      };
    }
  }
}

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Formato "Bearer TOKEN"

  if (!token) {
    return res.status(401).json({ message: 'Acceso denegado. No se proporcionó token.' });
  }

  try {
    // Verificar el token con el secreto
    const payload = jwt.verify(token, JWT_SECRET) as { userId: string };

    if (!payload || !payload.userId) {
       return res.status(403).json({ message: 'Token inválido o malformado.' });
    }

    // Adjuntamos el usuario al objeto request para usarlo en los controladores
    req.user = { id: payload.userId };
    
    // Pasar al siguiente controlador/middleware
    next();
  } catch (error) {
    // Esto captura errores como "token expired" o "invalid signature"
    return res.status(403).json({ message: 'Token inválido o expirado.' });
  }
};