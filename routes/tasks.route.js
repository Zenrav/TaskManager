import { Router } from 'express';
import { createTask } from '../controllers/tasks.controller.js';
import { getAllTasks } from '../controllers/tasks.controller.js';
import { getTaskById } from '../controllers/tasks.controller.js';
import { updateTask } from '../controllers/tasks.controller.js';
import { deleteTask } from '../controllers/tasks.controller.js';
import { getMyTasks } from '../controllers/tasks.controller.js';
import authMiddleware from '../middlewares/auth.middleware.js';
import authorizeRole from '../middlewares/authorize.middleware.js';
import { validate } from '../middlewares/validate.middleware.js';

import { createTaskSchema } from '../utils/validation.js';
import { updateTaskSchema } from '../utils/validation.js';

const tasksRouter  = Router();


tasksRouter.get("/tasks", authMiddleware, authorizeRole('manager'), getAllTasks);
tasksRouter.post("/tasks", authMiddleware, authorizeRole('manager'), validate(createTaskSchema),createTask);
tasksRouter.get("/tasks/my-tasks", authMiddleware, authorizeRole('engineer'), getMyTasks);
tasksRouter.get("/tasks/:id", authMiddleware, authorizeRole('manager'), getTaskById);
tasksRouter.put("/tasks/:id", authMiddleware, authorizeRole('manager'),validate(updateTaskSchema), updateTask);
tasksRouter.delete("/tasks/:id", authMiddleware, authorizeRole('manager'), deleteTask);


export default tasksRouter;
