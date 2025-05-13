import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Use the same secret as in the controller. Move to env variables for production.
const JWT_SECRET = 'tu_clave_secreta';

// Extend the Express Request interface to include userId
declare global {
  namespace Express {
    interface Request {
      userId?: string;
    }
  }
}

export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (token == null) {
    return res.sendStatus(401); // if there isn't any token
  }

  jwt.verify(token, JWT_SECRET, (err: any, payload: any) => {
    if (err) {
      console.error('JWT Verification Error:', err.message);
      return res.sendStatus(403); // Forbidden (invalid token)
    }

    // Check if payload has userId
    if (!payload || typeof payload.userId !== 'string') {
        console.error('JWT Payload Error: userId missing or invalid');
        return res.sendStatus(403); // Forbidden (invalid payload)
    }

    req.userId = payload.userId; // Attach userId to the request object
    next(); // pass the execution off to whatever request the client intended
  });
};
