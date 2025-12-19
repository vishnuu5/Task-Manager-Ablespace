import { Router } from "express";
import { authenticate as authMiddleware } from "../middleware/auth.middleware";
import { userController } from "../controllers/user.controller";

const router = Router();

router.get("/", authMiddleware, userController.getAllUsers);

export default router;
