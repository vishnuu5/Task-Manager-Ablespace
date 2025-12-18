export type Priority = "Low" | "Medium" | "High" | "Urgent";
export type Status = "To Do" | "In Progress" | "Review" | "Completed";

export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  priority: Priority;
  status: Status;
  creatorId: string;
  assignedToId?: string;
  creator?: User;
  assignedTo?: User;
  createdAt: string;
  updatedAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  message: string;
  taskId?: string;
  read: boolean;
  createdAt: string;
}

export interface DashboardStats {
  assignedToMe: Task[];
  createdByMe: Task[];
  overdue: Task[];
}
