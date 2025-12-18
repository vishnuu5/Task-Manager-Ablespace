import { NotificationRepository } from "../repositories/notification.repository";

export class NotificationService {
  private notificationRepository: NotificationRepository;

  constructor() {
    this.notificationRepository = new NotificationRepository();
  }

  async getUserNotifications(userId: string) {
    return this.notificationRepository.findByUserId(userId);
  }

  async markAsRead(id: string, userId: string) {
    return this.notificationRepository.markAsRead(id);
  }
  async createNotification(data: {
    userId: string;
    message: string;
    taskId?: string;
  }) {
    return this.notificationRepository.create(data);
  }

  async deleteNotification(id: string, userId: string): Promise<void> {
    const notification = await this.notificationRepository.findByUserId(userId);
    const notificationExists = notification.some(n => n.id === id);
    
    if (!notificationExists) {
      throw new Error('Notification not found or access denied');
    }
    
    await this.notificationRepository.delete(id, userId);
  }

  async deleteAllNotifications(userId: string): Promise<void> {
    await this.notificationRepository.deleteAll(userId);
  }
}
