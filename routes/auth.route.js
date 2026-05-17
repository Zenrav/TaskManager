import { Router } from 'express';
import { login } from '../controllers/auth.controller.js';
import { register } from '../controllers/auth.controller.js';
import { refreshToken } from '../controllers/auth.controller.js';
import { validate } from '../middlewares/validate.middleware.js';
import { registerSchema } from '../utils/validation.js';
import { loginSchema } from '../utils/validation.js';
import { logout } from '../controllers/auth.controller.js';
import { logoutAll } from '../controllers/auth.controller.js';
const authRouter = Router();

authRouter.post('/auth/login', validate(loginSchema),login);
authRouter.post('/auth/register', validate(registerSchema), register);
authRouter.get('/auth/refresh-token/', refreshToken);
authRouter.get('/auth/logout', logout);
authRouter.get('/auth/logout-all', logoutAll);
export default authRouter;