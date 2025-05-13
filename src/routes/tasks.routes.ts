import { Router } from 'express';
import { 
  getTasks, 
  createTask, 
  updateTask, 
  deleteTask, 
  authMiddleware 
} from '../controllers/tasks.controller';

const router = Router();

// Middleware de autenticación
router.use(authMiddleware);

// Definición de rutas
router.get('/', getTasks);
router.post('/', createTask);
router.patch('/:id', updateTask);
router.delete('/:id', deleteTask);

export default router;