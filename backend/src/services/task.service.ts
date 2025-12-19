import { TaskRepository } from "../repositories/task.repository"
import { NotificationRepository } from "../repositories/notification.repository"
import type { CreateTaskDto, UpdateTaskDto } from "../dto/task.dto"

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

/**
 * Task Service - Business logic for task management
 * Implements validation, authorization, and notification logic
 */
export class TaskService {
  private taskRepository: TaskRepository
  private notificationRepository: NotificationRepository

  constructor() {
    this.taskRepository = new TaskRepository()
    this.notificationRepository = new NotificationRepository()
  }

  /**
   * Create a new task
   * Validates input and creates notification if task is assigned
   */
  async createTask(data: CreateTaskDto, creatorId: string) {
    // Convert status format from "To Do" to "To_Do" for Prisma enum
    const statusMap: Record<string, Status> = {
      "To Do": Status.To_Do,
      "In Progress": Status.In_Progress,
      Review: Status.Review,
      Completed: Status.Completed,
    }

    const task = await this.taskRepository.create({
      ...data,
      dueDate: new Date(data.dueDate),
      priority: data.priority as Priority,
      status: statusMap[data.status] || ("To_Do" as Status),
      creatorId,
    })

    // Create notification if task is assigned
    if (data.assignedToId && data.assignedToId !== creatorId) {
      await this.notificationRepository.create({
        userId: data.assignedToId,
        message: `You have been assigned a new task: ${data.title}`,
        taskId: task.id,
      })
    }

    return this.formatTask(task)
  }

  /**
   * Get all tasks with optional filters
   */
  async getAllTasks(filters?: {
    status?: string
    priority?: string
    sortBy?: string
  }) {
    const statusMap: Record<string, Status> = {
      "To Do": Status.To_Do,
      "In Progress": Status.In_Progress,
      Review: Status.Review,
      Completed: Status.Completed,
    }

    const tasks = await this.taskRepository.findAll({
      ...(filters?.status && { status: statusMap[filters.status] }),
      ...(filters?.priority && { priority: filters.priority as Priority }),
      sortBy: filters?.sortBy || "createdAt",
    })

    return tasks.map(this.formatTask)
  }

  /**
   * Get task by ID
   */
  async getTaskById(id: string) {
    const task = await this.taskRepository.findById(id)
    if (!task) {
      throw new Error("Task not found")
    }
    return this.formatTask(task)
  }

  /**
   * Update a task
   * Handles assignment notifications
   */
  async updateTask(id: string, data: UpdateTaskDto, userId: string) {
    const existingTask = await this.taskRepository.findById(id)
    if (!existingTask) {
      throw new Error("Task not found")
    }

    // Convert status format
    const statusMap: Record<string, Status> = {
      "To Do": Status.To_Do,
      "In Progress": Status.In_Progress,
      Review: Status.Review,
      Completed: Status.Completed,
    }

    const updateData: any = {}

    if (data.title !== undefined) updateData.title = data.title
    if (data.description !== undefined) updateData.description = data.description
    if (data.priority !== undefined) updateData.priority = data.priority

    if (data.status) {
      updateData.status = statusMap[data.status] || data.status
    }

    if (data.dueDate) {
      updateData.dueDate = new Date(data.dueDate)
    }

    // Only include assignedToId if it's provided and not empty
    if (data.assignedToId !== undefined) {
      if (data.assignedToId && data.assignedToId.trim() !== "") {
        updateData.assignedToId = data.assignedToId
      } else {
        // Set to null to unassign
        updateData.assignedToId = null
      }
    }

    // Check if assignee changed
    const assigneeChanged = data.assignedToId !== undefined && data.assignedToId !== existingTask.assignedToId

    const task = await this.taskRepository.update(id, updateData)

    // Create notification for new assignee
    if (assigneeChanged && data.assignedToId && data.assignedToId !== userId) {
      await this.notificationRepository.create({
        userId: data.assignedToId,
        message: `You have been assigned to task: ${task.title}`,
        taskId: task.id,
      })
    }

    return this.formatTask(task)
  }

  /**
   * Delete a task
   */
  async deleteTask(id: string, userId: string) {
    const task = await this.taskRepository.findById(id)
    if (!task) {
      throw new Error("Task not found")
    }

    // Only creator can delete
    if (task.creatorId !== userId) {
      throw new Error("Unauthorized to delete this task")
    }

    await this.taskRepository.delete(id)
    return { message: "Task deleted successfully" }
  }

  /**
   * Get dashboard statistics for a user
   */
  async getDashboardStats(userId: string) {
    const [assignedToMe, createdByMe, overdue] = await Promise.all([
      this.taskRepository.findByAssignedTo(userId),
      this.taskRepository.findByCreator(userId),
      this.taskRepository.findOverdue(),
    ])

    // Filter overdue tasks for current user
    const userOverdue = overdue.filter((task) => task.assignedToId === userId || task.creatorId === userId)

    return {
      assignedToMe: assignedToMe.map(this.formatTask),
      createdByMe: createdByMe.map(this.formatTask),
      overdue: userOverdue.map(this.formatTask),
    }
  }

  /**
   * Format task to convert enum values to display format
   */
  private formatTask(task: any) {
    const statusMap: Record<string, string> = {
      To_Do: "To Do",
      In_Progress: "In Progress",
      Review: "Review",
      Completed: "Completed",
    }

    return {
      ...task,
      status: statusMap[task.status] || task.status,
    }
  }
}
