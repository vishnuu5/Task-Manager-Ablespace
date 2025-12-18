"use client";

import type { Task } from "@/types";
import { formatDate, isOverdue, cn } from "@/lib/utils";
import { Clock, User } from "lucide-react";

interface TaskCardProps {
  task: Task;
  onClick?: () => void;
  className?: string;
}

const priorityColors = {
  Low: "text-green-700 bg-green-50 border border-green-100",
  Medium: "text-yellow-700 bg-yellow-50 border border-yellow-100",
  High: "text-orange-700 bg-orange-50 border border-orange-100",
  Urgent: "text-red-700 bg-red-50 border border-red-100",
};

const statusColors = {
  "To Do": "text-gray-700 bg-gray-50 border border-gray-100",
  "In Progress": "text-blue-700 bg-blue-50 border border-blue-100",
  Review: "text-purple-700 bg-purple-50 border border-purple-100",
  Completed: "text-green-700 bg-green-50 border border-green-100",
};

export function TaskCard({ task, onClick, className }: TaskCardProps) {
  const overdue = isOverdue(task.dueDate) && task.status !== "Completed";

  return (
    <div
      onClick={onClick}
      className={cn(
        "group relative p-5 sm:p-6 border border-border/70 rounded-xl bg-card/80 hover:bg-card/90",
        "transition-all duration-200 ease-in-out cursor-pointer",
        "hover:shadow-md hover:shadow-primary/5 hover:border-primary/40",
        "focus:outline-none focus:ring-2 focus:ring-primary/30 focus:ring-offset-2",
        "active:scale-[0.99] active:shadow-sm",
        className
      )}
      tabIndex={0}
    >
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-4">
        <h3 className="font-semibold text-foreground text-base sm:text-lg leading-tight flex-1 pr-2 group-hover:text-primary transition-colors">
          {task.title}
        </h3>
        <div className="flex items-center gap-2">
          <span
            className={cn(
              "px-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap",
              "transition-colors duration-200",
              priorityColors[task.priority]
            )}
          >
            {task.priority}
          </span>
        </div>
      </div>

      <p className="text-muted-foreground text-sm mb-5 line-clamp-2 leading-relaxed">
        {task.description || 'No description provided'}
      </p>

      <div className="flex flex-wrap items-center gap-3 text-sm pt-3 border-t border-border/50">
        <div className="flex items-center gap-2 flex-wrap">
          <span
            className={cn(
              "px-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap",
              "transition-colors duration-200",
              statusColors[task.status]
            )}
          >
            {task.status}
          </span>

          <div
            className={cn(
              "flex items-center gap-1.5 text-muted-foreground px-2.5 py-1 rounded-full bg-muted/50",
              "transition-colors duration-200",
              overdue && "text-red-600 bg-red-50/80"
            )}
          >
            <Clock className="h-3.5 w-3.5 shrink-0" />
            <span className="text-xs whitespace-nowrap">
              {formatDate(task.dueDate)}
              {overdue && <span className="ml-1 font-semibold">• Overdue</span>}
            </span>
          </div>

          {task.assignedTo && (
            <div className="flex items-center gap-1.5 text-muted-foreground px-2.5 py-1 rounded-full bg-muted/50">
              <User className="h-3.5 w-3.5 shrink-0" />
              <span className="text-xs whitespace-nowrap">{task.assignedTo.name}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
