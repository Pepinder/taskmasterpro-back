import { Router, Request, Response, RequestHandler } from 'express';
import { register, login } from '../controllers/users.controller';

const router = Router();

router.post('/register', register as RequestHandler);
router.post('/login', login as RequestHandler);

export default router;
