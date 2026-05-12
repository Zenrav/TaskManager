import { Router } from 'express';
import { login } from '../controllers/auth.controller.js';
import { register } from '../controllers/auth.controller.js';


const authRouter = Router();

authRouter.post('/auth/login', login);
authRouter.post('/auth/register', register);

export default authRouter;