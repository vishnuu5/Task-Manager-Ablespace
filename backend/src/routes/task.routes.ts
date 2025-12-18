import { Router } from "express";
import { TaskController } from "../controllers/task.controller";
import { validate } from "../middleware/validation.middleware";
import { authenticate } from "../middleware/auth.middleware";
import { createTaskSchema, updateTaskSchema } from "../dto/task.dto";

const router = Router();
const taskController = new TaskController();

router.use(authenticate);

router.post("/", validate(createTaskSchema), taskController.create);
router.get("/", taskController.getAll);
router.get("/dashboard/stats", taskController.getDashboard);
router.get("/:id", taskController.getById);
router.patch("/:id", validate(updateTaskSchema), taskController.update);
router.delete("/:id", taskController.delete);

export default router;
