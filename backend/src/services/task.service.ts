import { TaskRepository } from "../repositories/task.repository";
import { NotificationRepository } from "../repositories/notification.repository";
import type { CreateTaskDto, UpdateTaskDto } from "../dto/task.dto";

enum Priority {
  Low = "Low",
  Medium = "Medium",
  High = "High",
}

enum Status {
  To_Do = "To_Do",
  In_Progress = "In_Progress",
  Review = "Review",
  Completed = "Completed",
}

export class TaskService {
  private taskRepository: TaskRepository;
  private notificationRepository: NotificationRepository;

  constructor() {
    this.taskRepository = new TaskRepository();
    this.notificationRepository = new NotificationRepository();
  }

  async createTask(data: CreateTaskDto, creatorId: string) {
    const statusMap: Record<string, Status> = {
      "To Do": Status.To_Do,
      "In Progress": Status.In_Progress,
      Review: Status.Review,
      Completed: Status.Completed,
    };

    const task = await this.taskRepository.create({
      ...data,
      dueDate: new Date(data.dueDate),
      priority: data.priority as Priority,
      status: statusMap[data.status] || ("To_Do" as Status),
      creatorId,
    });
    if (data.assignedToId && data.assignedToId !== creatorId) {
      await this.notificationRepository.create({
        userId: data.assignedToId,
        message: `You have been assigned a new task: ${data.title}`,
        taskId: task.id,
      });
    }

    return this.formatTask(task);
  }
  async getAllTasks(filters?: {
    status?: string;
    priority?: string;
    sortBy?: string;
  }) {
    const statusMap: Record<string, Status> = {
      "To Do": Status.To_Do,
      "In Progress": Status.In_Progress,
      Review: Status.Review,
      Completed: Status.Completed,
    };

    const tasks = await this.taskRepository.findAll({
      ...(filters?.status && { status: statusMap[filters.status] }),
      ...(filters?.priority && { priority: filters.priority as Priority }),
      sortBy: filters?.sortBy || "createdAt",
    });

    return tasks.map(this.formatTask);
  }

  async getTaskById(id: string) {
    const task = await this.taskRepository.findById(id);
    if (!task) {
      throw new Error("Task not found");
    }
    return this.formatTask(task);
  }

  async updateTask(id: string, data: UpdateTaskDto, userId: string) {
    const existingTask = await this.taskRepository.findById(id);
    if (!existingTask) {
      throw new Error("Task not found");
    }
    const statusMap: Record<string, Status> = {
      "To Do": Status.To_Do,
      "In Progress": Status.In_Progress,
      Review: Status.Review,
      Completed: Status.Completed,
    };

    const updateData: any = { ...data };
    if (data.status) {
      updateData.status = statusMap[data.status] || data.status;
    }
    if (data.dueDate) {
      updateData.dueDate = new Date(data.dueDate);
    }
    const assigneeChanged =
      data.assignedToId !== undefined &&
      data.assignedToId !== existingTask.assignedToId;

    const task = await this.taskRepository.update(id, updateData);

    if (assigneeChanged && data.assignedToId && data.assignedToId !== userId) {
      await this.notificationRepository.create({
        userId: data.assignedToId,
        message: `You have been assigned to task: ${task.title}`,
        taskId: task.id,
      });
    }

    return this.formatTask(task);
  }
  async deleteTask(id: string, userId: string) {
    const task = await this.taskRepository.findById(id);
    if (!task) {
      throw new Error("Task not found");
    }
    if (task.creatorId !== userId) {
      throw new Error("Unauthorized to delete this task");
    }

    await this.taskRepository.delete(id);
    return { message: "Task deleted successfully" };
  }

  async getDashboardStats(userId: string) {
    const [assignedToMe, createdByMe, overdue] = await Promise.all([
      this.taskRepository.findByAssignedTo(userId),
      this.taskRepository.findByCreator(userId),
      this.taskRepository.findOverdue(),
    ]);
    const userOverdue = overdue.filter(
      (task) => task.assignedToId === userId || task.creatorId === userId
    );

    return {
      assignedToMe: assignedToMe.map(this.formatTask),
      createdByMe: createdByMe.map(this.formatTask),
      overdue: userOverdue.map(this.formatTask),
    };
  }
  private formatTask(task: any) {
    const statusMap: Record<string, string> = {
      To_Do: "To Do",
      In_Progress: "In Progress",
      Review: "Review",
      Completed: "Completed",
    };

    return {
      ...task,
      status: statusMap[task.status] || task.status,
    };
  }
}
