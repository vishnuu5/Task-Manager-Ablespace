"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import type { Task } from "@/types"
import { useEffect } from "react"

const taskSchema = z.object({
  title: z.string().min(1, "Title is required").max(100, "Title must be less than 100 characters"),
  description: z.string().min(1, "Description is required"),
  dueDate: z.string().min(1, "Due date is required"),
  priority: z.enum(["Low", "Medium", "High", "Urgent"]),
  status: z.enum(["To Do", "In Progress", "Review", "Completed"]),
  assignedToId: z.string().optional(),
})

type TaskFormData = z.infer<typeof taskSchema>

interface TaskFormProps {
  onSubmit: (data: TaskFormData) => Promise<void>
  defaultValues?: Partial<Task>
  users?: { id: string; name: string }[]
  loading?: boolean
}

export function TaskForm({ onSubmit, defaultValues, users = [], loading }: TaskFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<TaskFormData>({
    resolver: zodResolver(taskSchema),
    defaultValues: defaultValues
      ? {
          title: defaultValues.title || "",
          description: defaultValues.description || "",
          dueDate: defaultValues.dueDate ? new Date(defaultValues.dueDate).toISOString().slice(0, 16) : "",
          priority: defaultValues.priority || "Medium",
          status: defaultValues.status || "To Do",
          assignedToId: defaultValues.assignedToId || "",
        }
      : {
          priority: "Medium",
          status: "To Do",
        },
  })

  useEffect(() => {
    if (defaultValues) {
      let formattedDate = ""
      if (defaultValues.dueDate) {
        const date = new Date(defaultValues.dueDate)
        formattedDate = date.toISOString().slice(0, 16)
      }

      reset({
        title: defaultValues.title || "",
        description: defaultValues.description || "",
        dueDate: formattedDate,
        priority: defaultValues.priority || "Medium",
        status: defaultValues.status || "To Do",
        assignedToId: defaultValues.assignedToId || "",
      })
    }
  }, [defaultValues, reset])

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-foreground mb-2">
          Title *
        </label>
        <input
          id="title"
          type="text"
          {...register("title")}
          className="w-full px-4 py-3 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-shadow"
        />
        {errors.title && <p className="text-red-500 text-sm mt-2">{errors.title.message}</p>}
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-foreground mb-2">
          Description *
        </label>
        <textarea
          id="description"
          rows={4}
          {...register("description")}
          className="w-full px-4 py-3 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-shadow resize-none"
        />
        {errors.description && <p className="text-red-500 text-sm mt-2">{errors.description.message}</p>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="dueDate" className="block text-sm font-medium text-foreground mb-2">
            Due Date *
          </label>
          <input
            id="dueDate"
            type="datetime-local"
            {...register("dueDate")}
            className="w-full px-4 py-3 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-shadow"
          />
          {errors.dueDate && <p className="text-red-500 text-sm mt-2">{errors.dueDate.message}</p>}
        </div>

        <div>
          <label htmlFor="priority" className="block text-sm font-medium text-foreground mb-2">
            Priority *
          </label>
          <select
            id="priority"
            {...register("priority")}
            className="w-full px-4 py-3 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-shadow"
          >
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
            <option value="Urgent">Urgent</option>
          </select>
          {errors.priority && <p className="text-red-500 text-sm mt-2">{errors.priority.message}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="status" className="block text-sm font-medium text-foreground mb-2">
            Status *
          </label>
          <select
            id="status"
            {...register("status")}
            className="w-full px-4 py-3 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-shadow"
          >
            <option value="To Do">To Do</option>
            <option value="In Progress">In Progress</option>
            <option value="Review">Review</option>
            <option value="Completed">Completed</option>
          </select>
          {errors.status && <p className="text-red-500 text-sm mt-2">{errors.status.message}</p>}
        </div>

        <div>
          <label htmlFor="assignedToId" className="block text-sm font-medium text-foreground mb-2">
            Assign To
          </label>
          <select
            id="assignedToId"
            {...register("assignedToId")}
            className="w-full px-4 py-3 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-shadow"
          >
            <option value="">Unassigned</option>
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-primary text-primary-foreground py-3 px-4 rounded-md font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
      >
        {loading ? "Saving..." : defaultValues ? "Update Task" : "Create Task"}
      </button>
    </form>
  )
}
