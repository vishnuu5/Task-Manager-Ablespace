import { PrismaClient, type Task as PrismaTask, type User } from "@prisma/client"

type Priority = 'Low' | 'Medium' | 'High' | 'Urgent'
type Status = 'To_Do' | 'In_Progress' | 'Review' | 'Completed'

const prisma = new PrismaClient()

type Task = PrismaTask & {
  creator: Pick<User, 'id' | 'name' | 'email'>
  assignedTo: Pick<User, 'id' | 'name' | 'email'> | null
}

/**
 * Task Repository - Data access layer for Task entity
 */
export class TaskRepository {
  /**
   * Create a new task
   */
  async create(data: {
    title: string
    description: string
    dueDate: Date
    priority: Priority
    status: Status
    creatorId: string
    assignedToId?: string
  }): Promise<Task> {
    return prisma.task.create({
      data,
      include: {
        creator: { select: { id: true, name: true, email: true } },
        assignedTo: { select: { id: true, name: true, email: true } },
      },
    })
  }

  /**
   * Find task by ID
   */
  async findById(id: string): Promise<Task | null> {
    return prisma.task.findUnique({
      where: { id },
      include: {
        creator: { select: { id: true, name: true, email: true } },
        assignedTo: { select: { id: true, name: true, email: true } },
      },
    })
  }

  /**
   * Find all tasks with optional filters
   */
  async findAll(filters?: {
    status?: Status
    priority?: Priority
    sortBy?: string
  }): Promise<Task[]> {
    const { status, priority, sortBy = "createdAt" } = filters || {}

    return prisma.task.findMany({
      where: {
        ...(status && { status }),
        ...(priority && { priority }),
      },
      include: {
        creator: { select: { id: true, name: true, email: true } },
        assignedTo: { select: { id: true, name: true, email: true } },
      },
      orderBy: { [sortBy]: "desc" },
    })
  }

  /**
   * Update a task
   */
  async update(
    id: string,
    data: Partial<{
      title?: string
      description?: string
      dueDate?: Date
      priority?: Priority
      status?: Status
      assignedToId?: string | null
    }>,
  ): Promise<Task> {
    const cleanData: any = {}

    if (data.title !== undefined) cleanData.title = data.title
    if (data.description !== undefined) cleanData.description = data.description
    if (data.dueDate !== undefined) cleanData.dueDate = data.dueDate
    if (data.priority !== undefined) cleanData.priority = data.priority
    if (data.status !== undefined) cleanData.status = data.status

    // Handle assignedToId specially - convert empty string to null
    if (data.assignedToId !== undefined) {
      if (data.assignedToId === null || data.assignedToId === "") {
        cleanData.assignedToId = null
      } else {
        cleanData.assignedToId = data.assignedToId
      }
    }

    return prisma.task.update({
      where: { id },
      data: cleanData,
      include: {
        creator: { select: { id: true, name: true, email: true } },
        assignedTo: { select: { id: true, name: true, email: true } },
      },
    })
  }

  /**
   * Delete a task
   */
  async delete(id: string): Promise<Task> {
    return prisma.task.delete({ where: { id } })
  }

  /**
   * Find tasks assigned to a user
   */
  async findByAssignedTo(userId: string): Promise<Task[]> {
    return prisma.task.findMany({
      where: { assignedToId: userId },
      include: {
        creator: { select: { id: true, name: true, email: true } },
        assignedTo: { select: { id: true, name: true, email: true } },
      },
      orderBy: { dueDate: "asc" },
    })
  }

  /**
   * Find tasks created by a user
   */
  async findByCreator(userId: string): Promise<Task[]> {
    return prisma.task.findMany({
      where: { creatorId: userId },
      include: {
        creator: { select: { id: true, name: true, email: true } },
        assignedTo: { select: { id: true, name: true, email: true } },
      },
      orderBy: { createdAt: "desc" },
    })
  }

  /**
   * Find overdue tasks
   */
  async findOverdue(): Promise<Task[]> {
    return prisma.task.findMany({
      where: {
        dueDate: { lt: new Date() },
        status: { not: "Completed" as Status },
      },
      include: {
        creator: { select: { id: true, name: true, email: true } },
        assignedTo: { select: { id: true, name: true, email: true } },
      },
      orderBy: { dueDate: "asc" },
    })
  }
}
