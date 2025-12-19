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
      const taskId = req.params.id;
      const userId = req.userId!;
      
      if (!taskId) {
        res.status(400).json({ message: 'Task ID is required' });
        return;
      }
      
      const result = await taskService.deleteTask(taskId, userId);
      
      if (result === null) {
        // Task not found
        res.status(404).json({ message: 'Task not found' });
        return;
      }
      
      // Task was deleted successfully
      const io = req.app.get("io");
      io.emit("task:deleted", { id: taskId });
      
      res.status(200).json(result);
    } catch (error) {
      console.error('Error deleting task:', error);
      
      // If it's an unauthorized error
      if (error && typeof error === 'object' && 'status' in error && error.status === 403) {
        res.status(403).json({ 
          message: 'Unauthorized to delete this task',
          error: 'FORBIDDEN'
        });
        return;
      }
      
      // For other errors, pass to error handler with proper status code
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      res.status(500).json({
        message: 'Failed to delete task',
        error: 'INTERNAL_SERVER_ERROR',
        details: process.env.NODE_ENV === 'development' ? errorMessage : undefined
      });
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
