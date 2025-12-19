import "dotenv/config";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export class NotificationRepository {
  async create(data: {
    userId: string;
    message: string;
    taskId?: string;
  }): Promise<any> {
    return prisma.notification.create({ data });
  }
  async findByUserId(userId: string): Promise<any[]> {
    return prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });
  }
  async markAsRead(id: string): Promise<any> {
    return prisma.notification.update({
      where: { id },
      data: { read: true },
    });
  }

  async delete(id: string, userId: string): Promise<void> {
    await prisma.notification.deleteMany({
      where: {
        id,
        userId,
      },
    });
  }

  async deleteAll(userId: string): Promise<void> {
    await prisma.notification.deleteMany({
      where: { userId },
    });
  }
  async deleteOldReadNotifications(
    userId: string,
    daysOld = 30
  ): Promise<number> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysOld);

    const result = await prisma.notification.deleteMany({
      where: {
        userId,
        read: true,
        createdAt: { lt: cutoffDate },
      },
    });

    return result.count;
  }
}
