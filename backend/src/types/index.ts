import { Request } from "express";

export interface AuthRequest extends Request {
  userId?: string;
}

export enum Priority {
  Low = "Low",
  Medium = "Medium",
  High = "High",
  Urgent = "Urgent",
}

export enum Status {
  ToDo = "To Do",
  InProgress = "In Progress",
  Review = "Review",
  Completed = "Completed",
}
