"use client";

import { ChevronDown } from "lucide-react";

interface TaskFiltersProps {
  status: string;
  priority: string;
  sortBy: string;
  onStatusChange: (status: string) => void;
  onPriorityChange: (priority: string) => void;
  onSortChange: (sort: string) => void;
}

export function TaskFilters({
  status,
  priority,
  sortBy,
  onStatusChange,
  onPriorityChange,
  onSortChange,
}: TaskFiltersProps) {
  return (
    <div className="flex flex-col md:flex-row gap-4 sm:gap-6 mb-8 p-4 sm:p-6 bg-card/80 border border-border/70 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200">
      <div className="flex-1 min-w-0">
        <label
          htmlFor="status"
          className="block text-xs sm:text-sm font-medium text-foreground/90 mb-1.5 sm:mb-2"
        >
          Status
        </label>
        <div className="relative">
          <select
            id="status"
            value={status}
            onChange={(e) => onStatusChange(e.target.value)}
            className="w-full pl-3 pr-10 py-2.5 sm:py-2 text-sm border border-border/70 rounded-lg bg-background/90 text-foreground/90 
                     focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/70 
                     hover:border-foreground/30 transition-all duration-200 appearance-none"
          >
            <option value="">All Statuses</option>
            <option value="To Do">To Do</option>
            <option value="In Progress">In Progress</option>
            <option value="Review">Review</option>
            <option value="Completed">Completed</option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-foreground/50">
            <ChevronDown className="h-4 w-4" />
          </div>
        </div>
      </div>

      <div className="flex-1 min-w-0">
        <label
          htmlFor="priority"
          className="block text-xs sm:text-sm font-medium text-foreground/90 mb-1.5 sm:mb-2"
        >
          Priority
        </label>
        <div className="relative">
          <select
            id="priority"
            value={priority}
            onChange={(e) => onPriorityChange(e.target.value)}
            className="w-full pl-3 pr-10 py-2.5 sm:py-2 text-sm border border-border/70 rounded-lg bg-background/90 text-foreground/90 
                     focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/70 
                     hover:border-foreground/30 transition-all duration-200 appearance-none"
          >
            <option value="">All Priorities</option>
            <option value="Urgent">Urgent</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-foreground/50">
            <ChevronDown className="h-4 w-4" />
          </div>
        </div>
      </div>

      <div className="flex-1 min-w-0">
        <label
          htmlFor="sortBy"
          className="block text-xs sm:text-sm font-medium text-foreground/90 mb-1.5 sm:mb-2"
        >
          Sort By
        </label>
        <div className="relative">
          <select
            id="sortBy"
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
            className="w-full pl-3 pr-10 py-2.5 sm:py-2 text-sm border border-border/70 rounded-lg bg-background/90 text-foreground/90 
                     focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/70 
                     hover:border-foreground/30 transition-all duration-200 appearance-none"
          >
            <option value="createdAt">Created Date (Newest)</option>
            <option value="dueDate">Due Date (Soonest)</option>
            <option value="priority">Priority (High to Low)</option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-foreground/50">
            <ChevronDown className="h-4 w-4" />
          </div>
        </div>
      </div>
    </div>
  );
}
