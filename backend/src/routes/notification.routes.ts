import { Router } from "express";
import { NotificationController } from "../controllers/notification.controller";
import { authenticate } from "../middleware/auth.middleware";

const router = Router();
const notificationController = new NotificationController();

router.use(authenticate);

router.get("/", notificationController.getAll);
router.patch("/:id/read", notificationController.markAsRead);
router.delete("/:id", notificationController.delete);
router.delete("/", notificationController.deleteAll);

export default router;
