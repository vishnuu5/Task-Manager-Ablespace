import "dotenv/config";
import { PrismaClient } from "@prisma/client";

type Priority = "Low" | "Medium" | "High" | "Urgent";
type Status = "To_Do" | "In_Progress" | "Review" | "Completed";

const prisma = new PrismaClient();

type TaskWithRelations = any;

export class TaskRepository {
  async create(data: {
    title: string;
    description: string;
    dueDate: Date;
    priority: Priority;
    status: Status;
    creatorId: string;
    assignedToId?: string;
  }): Promise<TaskWithRelations> {
    return prisma.task.create({
      data,
      include: {
        creator: { select: { id: true, name: true, email: true } },
        assignedTo: { select: { id: true, name: true, email: true } },
      },
    });
  }

  async findById(id: string): Promise<TaskWithRelations | null> {
    return prisma.task.findUnique({
      where: { id },
      include: {
        creator: { select: { id: true, name: true, email: true } },
        assignedTo: { select: { id: true, name: true, email: true } },
      },
    });
  }

  async findAll(filters?: {
    status?: Status;
    priority?: Priority;
    sortBy?: string;
  }): Promise<TaskWithRelations[]> {
    const { status, priority, sortBy = "createdAt" } = filters || {};

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
    });
  }
  async update(
    id: string,
    data: Partial<TaskWithRelations>
  ): Promise<TaskWithRelations> {
    return prisma.task.update({
      where: { id },
      data,
      include: {
        creator: { select: { id: true, name: true, email: true } },
        assignedTo: { select: { id: true, name: true, email: true } },
      },
    });
  }
  async delete(id: string): Promise<TaskWithRelations> {
    return prisma.task.delete({ where: { id } });
  }
  async findByAssignedTo(userId: string): Promise<TaskWithRelations[]> {
    return prisma.task.findMany({
      where: { assignedToId: userId },
      include: {
        creator: { select: { id: true, name: true, email: true } },
        assignedTo: { select: { id: true, name: true, email: true } },
      },
      orderBy: { dueDate: "asc" },
    });
  }
  async findByCreator(userId: string): Promise<TaskWithRelations[]> {
    return prisma.task.findMany({
      where: { creatorId: userId },
      include: {
        creator: { select: { id: true, name: true, email: true } },
        assignedTo: { select: { id: true, name: true, email: true } },
      },
      orderBy: { createdAt: "desc" },
    });
  }
  async findOverdue(): Promise<TaskWithRelations[]> {
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
    });
  }
}
