export interface Task {
    id: string;
    title: string;
    completed: boolean;
    userId: string | null; // ID del usuario al que pertenece la tarea
  }