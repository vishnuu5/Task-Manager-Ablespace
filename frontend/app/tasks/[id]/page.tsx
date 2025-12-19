"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import { useTask } from "@/hooks/use-tasks"
import { api } from "@/lib/api"
import { Navbar } from "@/components/layout/navbar"
import { TaskForm } from "@/components/tasks/task-form"
import { Skeleton } from "@/components/ui/skeleton"
import { Trash2 } from "lucide-react"
import { mutate as globalMutate } from "swr"

export default function TaskDetailPage() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const params = useParams()
  const taskId = params.id as string
  const { task, isLoading, mutate } = useTask(taskId)
  const [loading, setLoading] = useState(false)
  const [users, setUsers] = useState<{ id: string; name: string }[]>([])

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login")
    }
  }, [user, authLoading, router])

  useEffect(() => {
    if (user) {
      setUsers([{ id: user.id, name: user.name }])
    }
  }, [user])

  const handleSubmit = async (data: any) => {
    try {
      setLoading(true)

      const submitData: any = {
        title: data.title,
        description: data.description,
        dueDate: data.dueDate ? new Date(data.dueDate).toISOString() : undefined,
        priority: data.priority,
        status: data.status,
      }

      if (data.assignedToId && data.assignedToId.trim() !== "") {
        submitData.assignedToId = data.assignedToId
      }

      await api.tasks.update(taskId, submitData)
      mutate()
      router.push("/dashboard")
    } catch (error: any) {
      console.error("[v0] Update task error:", error)
      alert(error.message || "Failed to update task")
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this task?")) return

    try {
      await api.tasks.delete(taskId)

      await globalMutate((key) => typeof key === "string" && key.includes(taskId), undefined, { revalidate: false })

      router.replace("/dashboard")
    } catch (error: any) {
      alert(error.message || "Failed to delete task")
    }
  }

  if (authLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-foreground">Edit Task</h1>
          <button
            onClick={handleDelete}
            className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-md"
          >
            <Trash2 className="h-5 w-5" />
            Delete
          </button>
        </div>

        <div className="bg-card border border-border rounded-lg p-6">
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-12" />
              ))}
            </div>
          ) : task ? (
            <TaskForm onSubmit={handleSubmit} defaultValues={task} users={users} loading={loading} />
          ) : (
            <p className="text-muted-foreground">Task not found</p>
          )}
        </div>
      </main>
    </div>
  )
}
