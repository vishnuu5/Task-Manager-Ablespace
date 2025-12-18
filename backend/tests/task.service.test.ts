import { TaskService } from "../src/services/task.service";
import type { TaskRepository } from "../src/repositories/task.repository";
import type { NotificationRepository } from "../src/repositories/notification.repository";

jest.mock("../src/repositories/task.repository");
jest.mock("../src/repositories/notification.repository");

describe("TaskService", () => {
  let taskService: TaskService;
  let taskRepository: jest.Mocked<TaskRepository>;
  let notificationRepository: jest.Mocked<NotificationRepository>;

  beforeEach(() => {
    taskService = new TaskService();
    taskRepository = (taskService as any).taskRepository;
    notificationRepository = (taskService as any).notificationRepository;
  });

  describe("createTask", () => {
    it("should create a task successfully", async () => {
      const mockTask = {
        id: "1",
        title: "Test Task",
        description: "Test Description",
        dueDate: new Date(),
        priority: "High",
        status: "To_Do",
        creatorId: "user1",
        assignedToId: "user2",
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      taskRepository.create = jest.fn().mockResolvedValue(mockTask);
      notificationRepository.create = jest.fn().mockResolvedValue({});

      const result = await taskService.createTask(
        {
          title: "Test Task",
          description: "Test Description",
          dueDate: new Date().toISOString(),
          priority: "High",
          status: "To Do",
          assignedToId: "user2",
        },
        "user1"
      );

      expect(result.title).toBe("Test Task");
      expect(notificationRepository.create).toHaveBeenCalled();
    });

    it("should not create notification if task is assigned to creator", async () => {
      const mockTask = {
        id: "1",
        title: "Test Task",
        description: "Test Description",
        dueDate: new Date(),
        priority: "High",
        status: "To_Do",
        creatorId: "user1",
        assignedToId: "user1",
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      taskRepository.create = jest.fn().mockResolvedValue(mockTask);
      notificationRepository.create = jest.fn();

      await taskService.createTask(
        {
          title: "Test Task",
          description: "Test Description",
          dueDate: new Date().toISOString(),
          priority: "High",
          status: "To Do",
          assignedToId: "user1",
        },
        "user1"
      );

      expect(notificationRepository.create).not.toHaveBeenCalled();
    });
  });

  describe("updateTask", () => {
    it("should update task and create notification on assignee change", async () => {
      const existingTask = {
        id: "1",
        title: "Test Task",
        creatorId: "user1",
        assignedToId: "user2",
      };

      const updatedTask = {
        ...existingTask,
        assignedToId: "user3",
        status: "In_Progress",
      };

      taskRepository.findById = jest.fn().mockResolvedValue(existingTask);
      taskRepository.update = jest.fn().mockResolvedValue(updatedTask);
      notificationRepository.create = jest.fn().mockResolvedValue({});

      await taskService.updateTask(
        "1",
        { assignedToId: "user3", status: "In Progress" },
        "user1"
      );

      expect(notificationRepository.create).toHaveBeenCalledWith({
        userId: "user3",
        message: expect.stringContaining("assigned"),
        taskId: "1",
      });
    });
  });
});
