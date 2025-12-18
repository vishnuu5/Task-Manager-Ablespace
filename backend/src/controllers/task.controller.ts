import type { Response, NextFunction } from "express";
import { TaskService } from "../services/task.service";
import type { AuthRequest } from "../types";

const taskService = new TaskService();

export class TaskController {
  async create(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const task = await taskService.createTask(req.body, req.userId!);
      const io = req.app.get("io");
      io.emit("task:created", task);
      if (task.assignedToId) {
        io.to(`user:${task.assignedToId}`).emit("task:assigned", task);
        io.to(`user:${task.assignedToId}`).emit("notification:new");
      }

      res.status(201).json({ task });
    } catch (error) {
      next(error);
    }
  }
  async getAll(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { status, priority, sortBy } = req.query;
      const tasks = await taskService.getAllTasks({
        status: status as string,
        priority: priority as string,
        sortBy: sortBy as string,
      });

      res.json({ tasks });
    } catch (error) {
      next(error);
    }
  }
  async getById(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const task = await taskService.getTaskById(req.params.id);
      res.json({ task });
    } catch (error) {
      next(error);
    }
  }
  async update(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const task = await taskService.updateTask(
        req.params.id,
        req.body,
        req.userId!
      );
      const io = req.app.get("io");
      io.emit("task:updated", task);
      if (req.body.assignedToId) {
        io.to(`user:${req.body.assignedToId}`).emit("task:assigned", task);
        io.to(`user:${req.body.assignedToId}`).emit("notification:new");
      }

      res.json({ task });
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
      const result = await taskService.deleteTask(req.params.id, req.userId!);
      const io = req.app.get("io");
      io.emit("task:deleted", { id: req.params.id });

      res.json(result);
    } catch (error) {
      next(error);
    }
  }
  async getDashboard(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const stats = await taskService.getDashboardStats(req.userId!);
      res.json(stats);
    } catch (error) {
      next(error);
    }
  }
}
