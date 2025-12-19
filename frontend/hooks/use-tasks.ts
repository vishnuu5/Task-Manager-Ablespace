import useSWR from "swr"
import { api } from "@/lib/api"
import type { Task, DashboardStats } from "@/types"

export function useTasks(filters?: { status?: string; priority?: string; sortBy?: string }) {
  const { data, error, mutate } = useSWR<{ tasks: Task[] }>(
    filters ? ["/tasks", JSON.stringify(filters)] : "/tasks",
    async () => {
      const response = await api.tasks.getAll(filters)
      return response as { tasks: Task[] }
    },
  )

  return {
    tasks: data?.tasks || [],
    isLoading: !error && !data,
    isError: error,
    mutate,
  }
}

export function useTask(id: string) {
  const { data, error, mutate } = useSWR<{ task: Task }>(
    id ? `/tasks/${id}` : null,
    id
      ? async () => {
          const response = await api.tasks.getById(id)
          return response as { task: Task }
        }
      : null,
    {
      shouldRetryOnError: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      dedupingInterval: 5000,
      onError: (err) => {
        if (err?.message?.includes("Task not found") || err?.message?.includes("404")) {
          return
        }
      },
    },
  )

  return {
    task: data?.task,
    isLoading: !error && !data,
    isError: error,
    mutate,
  }
}

export function useDashboard() {
  const { data, error, mutate } = useSWR<DashboardStats>("/tasks/dashboard", async () => {
    const response = await api.tasks.getDashboard()
    return response as DashboardStats
  })

  return {
    stats: data,
    isLoading: !error && !data,
    isError: error,
    mutate,
  }
}
