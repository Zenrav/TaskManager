import Router from 'express';
import { createEngineer } from '../controllers/users.controller.js';
import { getUser } from '../controllers/users.controller.js';
import { getAllUsers } from '../controllers/users.controller.js';
import { updateUser } from '../controllers/users.controller.js';
import { deleteUser } from '../controllers/users.controller.js';
import authMiddleware from '../middlewares/auth.middleware.js';
import authorizeRole from '../middlewares/authorize.middleware.js';
import { validate } from '../middlewares/validate.middleware.js';
import { createEngineerSchema } from '../utils/validation.js';
const userRouter = Router();

userRouter.get('/users', authMiddleware, authorizeRole('manager'),getAllUsers);
userRouter.get('/users/:userId',authMiddleware, authorizeRole('manager', 'engineer'), getUser);

userRouter.post('/users/create', authMiddleware, authorizeRole('manager'),validate(createEngineerSchema),createEngineer);

userRouter.put('/users/:userId', authMiddleware, authorizeRole('manager'),updateUser);

userRouter.delete('/users/:id',authMiddleware, authorizeRole('manager'),deleteUser );

export default userRouter;
