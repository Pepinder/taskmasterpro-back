import express from 'express';
import cors from 'cors';
import tasksRouter from './routes/tasks.routes';
import userRouter from './routes/user.routes';
import 'dotenv/config';

const app = express();
app.use(cors());
app.use(express.json());

// Rutas
app.use('/users', userRouter)
app.use('/tasks', tasksRouter);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});