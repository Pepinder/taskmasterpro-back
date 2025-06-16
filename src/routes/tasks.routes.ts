import { Router, RequestHandler } from 'express';
import { 
  getTasks, 
  createTask, 
  updateTask, 
  deleteTask, 
} from '../controllers/tasks.controller';
import { authMiddleware } from '../middleware/auth.middleware'; 

const router = Router();

// Middleware de autenticación
router.use(authMiddleware as RequestHandler);

// Definición de rutas
router.get('/', getTasks);
router.post('/', createTask);
router.put('/:id', updateTask);
router.delete('/:id', deleteTask);

export default router;