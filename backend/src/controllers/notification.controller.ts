import type { Response, NextFunction } from "express";
import { NotificationService } from "../services/notification.service";
import type { AuthRequest } from "../types";

const notificationService = new NotificationService();

export class NotificationController {
  async getAll(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const notifications = await notificationService.getUserNotifications(
        req.userId!
      );
      res.json({ notifications });
    } catch (error) {
      next(error);
    }
  }
  async markAsRead(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const notification = await notificationService.markAsRead(
        req.params.id,
        req.userId!
      );
      res.json({ notification });
    } catch (error) {
      next(error);
    }
  }

  async delete(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      await notificationService.deleteNotification(req.params.id, req.userId!);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }

  async deleteAll(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      await notificationService.deleteAllNotifications(req.userId!);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}
