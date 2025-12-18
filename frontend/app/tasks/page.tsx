"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { useTasks } from "@/hooks/use-tasks";
import { useSocketEvents } from "@/hooks/use-socket";
import { Navbar } from "@/components/layout/navbar";
import { TaskCard } from "@/components/tasks/task-card";
import { TaskFilters } from "@/components/tasks/task-filters";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { Plus, ClipboardList } from "lucide-react";

export default function TasksPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [status, setStatus] = useState("");
  const [priority, setPriority] = useState("");
  const [sortBy, setSortBy] = useState("dueDate");

  const { tasks, isLoading } = useTasks({
    ...(status && { status }),
    ...(priority && { priority }),
    sortBy,
  });

  useSocketEvents();

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [user, authLoading, router]);

  if (authLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      <Navbar />

      <main className="max-w-7xl mx-auto px-2 sm:px-4 md:px-6 py-8 sm:py-10 md:py-12">
        <div className="mb-8 md:mb-10 px-2 sm:px-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-6">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">All Tasks</h1>
              <p className="mt-1 text-sm text-gray-600">View and manage all your tasks in one place</p>
            </div>
            <Link
              href="/tasks/new"
              className="inline-flex items-center px-4 py-2.5 border border-transparent text-sm sm:text-base font-medium rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
            >
              <Plus className="h-5 w-5 mr-2" />
              New Task
            </Link>
          </div>
        </div>

        <div className="px-2 sm:px-4">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 mb-8 md:mb-10">
            <TaskFilters
              status={status}
              priority={priority}
              sortBy={sortBy}
              onStatusChange={setStatus}
              onPriorityChange={setPriority}
              onSortChange={setSortBy}
            />
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                  <Skeleton className="h-48 w-full" />
                </div>
              ))}
            </div>
          ) : tasks.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 sm:p-10 md:p-12 text-center">
              <div className="max-w-md mx-auto">
                <ClipboardList className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-lg font-medium text-gray-900">No tasks</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Get started by creating a new task.
                </p>
                <div className="mt-6">
                  <Link
                    href="/tasks/new"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    New Task
                  </Link>
                </div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
              {tasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onClick={() => router.push(`/tasks/${task.id}`)}
                  className="h-full hover:shadow-md transition-shadow duration-200"
                />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
