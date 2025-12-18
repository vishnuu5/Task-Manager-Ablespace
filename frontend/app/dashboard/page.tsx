"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { useDashboard } from "@/hooks/use-tasks";
import { useSocketEvents } from "@/hooks/use-socket";
import { Navbar } from "@/components/layout/navbar";
import { TaskCard } from "@/components/tasks/task-card";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { Plus } from "lucide-react";

export default function DashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const { stats, isLoading } = useDashboard();
  const router = useRouter();
  useSocketEvents();

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [user, authLoading, router]);

  if (authLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="container max-w-350 mx-auto p-responsive">
        <div className="mb-8 md:mb-12">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-4 sm:space-y-0">
            <div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                  Dashboard
                </h1>
                <p className="mt-1 text-sm sm:text-base text-gray-600">
                  Welcome back,{" "}
                  <span className="font-medium text-blue-600">{user.name}</span>
                  ! Here's what's happening with your tasks.
                </p>
              </div>
            </div>
            <Link
              href="/tasks/new"
              className="inline-flex items-center px-4 py-2.5 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
            >
              <Plus className="h-5 w-5 mr-2" />
              New Task
            </Link>
          </div>

          {isLoading ? (
            <div className="space-y-12 md:space-y-14">
              {[1, 2, 3].map((i) => (
                <div key={i}>
                  <Skeleton className="h-8 w-48 mb-6" />
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {[1, 2, 3].map((j) => (
                      <Skeleton key={j} className="h-48" />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-responsive">
              <section className="p-responsive bg-white rounded-xl shadow-sm border border-gray-100 space-y-responsive">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-gray-900">
                    Assigned to Me
                  </h2>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                    {stats?.assignedToMe.length || 0} tasks
                  </span>
                </div>
                {stats?.assignedToMe.length === 0 ? (
                  <div className="bg-gray-50 rounded-lg p-6 sm:p-8 text-center hover:shadow-sm transition-all duration-200 border border-gray-100">
                    <p className="text-gray-500">
                      No tasks assigned to you yet. Enjoy your free time!
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 lg:grid-cols-3 gap-responsive p-1">
                    {stats?.assignedToMe.map((task) => (
                      <TaskCard
                        key={task.id}
                        task={task}
                        onClick={() => router.push(`/tasks/${task.id}`)}
                        className="h-full"
                      />
                    ))}
                  </div>
                )}
              </section>

              <section className="space-y-4 sm:space-y-5 md:space-y-6 p-3 sm:p-4 md:p-5 bg-white rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-center justify-between px-2 sm:px-3 py-2">
                  <h2 className="text-2xl font-bold text-gray-900">
                    Created by Me
                  </h2>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
                    {stats?.createdByMe.length || 0} tasks
                  </span>
                </div>
                {stats?.createdByMe.length === 0 ? (
                  <div className="bg-gray-50 rounded-lg p-6 sm:p-8 text-center hover:shadow-sm transition-all duration-200 border border-gray-100">
                    <p className="text-gray-500">
                      You haven't created any tasks yet. Get started by creating
                      one!
                    </p>
                    <div className="mt-4">
                      <Link
                        href="/tasks/new"
                        className="inline-flex items-center px-4 py-2.5 border border-transparent text-sm sm:text-base font-medium rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        New Task
                      </Link>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 lg:grid-cols-3 gap-responsive p-1">
                    {stats?.createdByMe.map((task) => (
                      <TaskCard
                        key={task.id}
                        task={task}
                        onClick={() => router.push(`/tasks/${task.id}`)}
                        className="h-full"
                      />
                    ))}
                  </div>
                )}
              </section>

              <section className="space-y-4 sm:space-y-5 md:space-y-6 p-3 sm:p-4 md:p-5 bg-white rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-center justify-between px-2 sm:px-3 py-2">
                  <h2 className="text-2xl font-bold text-red-600">
                    Overdue Tasks
                  </h2>
                  {stats?.overdue && stats.overdue.length > 0 && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
                      {stats.overdue.length} overdue
                    </span>
                  )}
                </div>
                {!stats?.overdue || stats.overdue.length === 0 ? (
                  <div className="bg-gray-50 rounded-lg p-6 sm:p-8 text-center hover:shadow-sm transition-all duration-200 border border-gray-100">
                    <p className="text-gray-500">
                      Great job! You don't have any overdue tasks.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 lg:grid-cols-3 gap-responsive p-1">
                    {stats.overdue.map((task) => (
                      <TaskCard
                        key={task.id}
                        task={task}
                        onClick={() => router.push(`/tasks/${task.id}`)}
                        className="h-full border-l-4 border-red-500"
                      />
                    ))}
                  </div>
                )}
              </section>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
