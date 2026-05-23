import { Router } from "express"
import { aiSchedule, askAi } from "../controllers/ai.controller.js";
import authMiddleware from '../middlewares/auth.middleware.js';
import authorizeRole from "../middlewares/authorize.middleware.js";
const aiRouter = Router();

aiRouter.get("/ai/schedule", authMiddleware, authorizeRole('engineer'),aiSchedule);
aiRouter.post("/ai/ask", authMiddleware, authorizeRole("engineer"), askAi);
export default aiRouter;