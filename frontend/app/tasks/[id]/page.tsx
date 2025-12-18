"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { useTask } from "@/hooks/use-tasks";
import { api } from "@/lib/api";
import { Navbar } from "@/components/layout/navbar";
import { TaskForm } from "@/components/tasks/task-form";
import { Skeleton } from "@/components/ui/skeleton";
import { Trash2 } from "lucide-react";

export default function TaskDetailPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const taskId = params.id as string;
  const { task, isLoading, mutate } = useTask(taskId);
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState<{ id: string; name: string }[]>([]);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user) {
      setUsers([{ id: user.id, name: user.name }]);
    }
  }, [user]);

  const handleSubmit = async (data: any) => {
    try {
      setLoading(true);
      // Format the date to ISO string if it exists
      const dataToSend = {
        ...data,
        dueDate: data.dueDate ? new Date(data.dueDate).toISOString() : undefined,
      };
      await api.tasks.update(taskId, dataToSend);
      await mutate();
      router.push("/dashboard");
    } catch (error: any) {
      console.error("Update error:", error);
      alert(error.message || "Failed to update task. Please check the console for more details.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this task?")) return;

    try {
      await api.tasks.delete(taskId);
      router.push("/dashboard");
    } catch (error: any) {
      alert(error.message || "Failed to delete task");
    }
  };

  if (authLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4 sm:p-6">
      <Navbar />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 md:py-16">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 sm:mb-10">
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Edit Task</h1>
          <button
            onClick={handleDelete}
            className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-md transition-colors duration-200 border border-transparent hover:border-red-200"
          >
            <Trash2 className="h-5 w-5" />
            Delete
          </button>
        </div>

        <div className="bg-card border border-border rounded-xl shadow-sm p-6 sm:p-8 md:p-10">
          {isLoading ? (
            <div className="space-y-6">
              {[1, 2, 3, 4, 5].map((i) => (
                <Skeleton key={i} className="h-14 rounded-lg" />
              ))}
            </div>
          ) : task ? (
            <TaskForm
              onSubmit={handleSubmit}
              defaultValues={task}
              users={users}
              loading={loading}
            />
          ) : (
            <div className="py-8 text-center">
              <p className="text-muted-foreground">Task not found</p>
              <button
                onClick={() => router.push('/dashboard')}
                className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
              >
                Back to Dashboard
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
