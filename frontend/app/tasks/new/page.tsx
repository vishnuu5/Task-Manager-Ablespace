"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { api } from "@/lib/api";
import { Navbar } from "@/components/layout/navbar";
import { TaskForm } from "@/components/tasks/task-form";

export default function NewTaskPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState<{ id: string; name: string }[]>([]);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const allUsers = await api.users.getAll();
        setUsers(allUsers);
      } catch (error) {
        console.error('Failed to fetch users:', error);
        // Fallback to current user if fetching all users fails
        if (user) {
          setUsers([{ id: user.id, name: user.name }]);
        }
      }
    };

    if (user) {
      fetchUsers();
    }
  }, [user]);

const handleSubmit = async (formData: any) => {
  try {
    setLoading(true);
    const taskData = {
      ...formData,
      dueDate: new Date(formData.dueDate).toISOString(),
      ...(formData.assignedToId ? { assignedToId: formData.assignedToId } : {})
    };

    await api.tasks.create(taskData);
    router.push("/dashboard");
  } catch (error: any) {
    alert(error.message || "Failed to create task");
  } finally {
    setLoading(false);
  }
};

  if (authLoading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4 sm:p-6">
      <Navbar />
      <main className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12 md:py-16">
        <div className="mb-8 sm:mb-10">
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
            Create New Task
          </h1>
          <p className="mt-2 text-muted-foreground">
            Fill in the details below to create a new task
          </p>
        </div>
        <section className="rounded-xl border border-border bg-card shadow-sm p-6 sm:p-8 md:p-10">
          <TaskForm onSubmit={handleSubmit} users={users} loading={loading} />
        </section>
      </main>
    </div>
  );
}
