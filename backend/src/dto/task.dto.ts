import { z } from "zod"

export const createTaskSchema = z.object({
  title: z.string().min(1, "Title is required").max(100, "Title must be less than 100 characters"),
  description: z.string().min(1, "Description is required"),
  dueDate: z.string().datetime("Invalid date format"),
  priority: z.enum(["Low", "Medium", "High", "Urgent"]),
  status: z.enum(["To Do", "In Progress", "Review", "Completed"]),
  assignedToId: z.string().optional(),
})

export const updateTaskSchema = z.object({
  title: z.string().min(1).max(100).optional(),
  description: z.string().min(1).optional(),
  dueDate: z
    .string()
    .refine((date) => !isNaN(Date.parse(date)), {
      message: "Invalid date format",
    })
    .optional(),
  priority: z.enum(["Low", "Medium", "High", "Urgent"]).optional(),
  status: z.enum(["To Do", "In Progress", "Review", "Completed"]).optional(),
  assignedToId: z.string().optional().nullable(),
})

export type CreateTaskDto = z.infer<typeof createTaskSchema>
export type UpdateTaskDto = z.infer<typeof updateTaskSchema>
