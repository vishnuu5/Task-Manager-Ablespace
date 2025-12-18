"use client";

import Link from "next/link";
import { useAuth } from "@/hooks/use-auth";
import { useNotifications } from "@/hooks/use-notifications";
import { Bell, LogOut, User, X, Trash2 } from "lucide-react";
import { useState } from "react";

export function Navbar() {
  const { user, logout } = useAuth();
  const { 
    notifications, 
    unreadCount, 
    deleteNotification, 
    deleteAllNotifications 
  } = useNotifications();
  const [showNotifications, setShowNotifications] = useState(false);

  if (!user) return null;

  return (
    <nav className="bg-card/95 backdrop-blur-sm border-b border-border/50 shadow-sm sticky top-0 z-40 w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 sm:h-20">
          <div className="flex items-center gap-6 sm:gap-8">
            <Link 
              href="/dashboard" 
              className="text-xl sm:text-2xl font-bold text-primary hover:opacity-90 transition-opacity"
            >
              TaskManager
            </Link>
            <div className="hidden md:flex items-center gap 1">
              <Link
                href="/dashboard"
                className="text-foreground/90 hover:text-primary px-3 py-2.5 text-sm font-medium transition-colors rounded-md hover:bg-muted/50"
              >
                Dashboard
              </Link>
              <Link
                href="/tasks"
                className="text-foreground/90 hover:text-primary px-3 py-2.5 text-sm font-medium transition-colors rounded-md hover:bg-muted/50"
              >
                All Tasks
              </Link>
            </div>
          </div>

          <div className="flex items-center gap-3 sm:gap-4 ">
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 text-foreground/80 hover:text-primary transition-colors rounded-md hover:bg-muted/50 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 focus:ring-offset-card cursor-pointer"
                aria-label="Notifications"
              >
                <Bell className="h-5 w-5 sm:h-6 sm:w-6" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] sm:text-xs rounded-full h-4 w-4 sm:h-5 sm:w-5 flex items-center justify-center font-medium ring-2 ring-card">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-card border border-border/50 rounded-lg shadow-xl z-50 max-h-[calc(100vh-5rem)] overflow-y-auto transition-all duration-200 ease-out">
                  <div className="p-1">
                    <div className="p-2 border-b border-border/50 sticky top-0 bg-card/95 backdrop-blur-sm z-10 flex justify-between items-center">
                      <h3 className="font-semibold text-foreground text-sm sm:text-base px-2 py-1">
                        Notifications
                      </h3>
                      {notifications.length > 0 && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteAllNotifications();
                          }}
                          className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 px-2 py-1 rounded hover:bg-muted/50 transition-colors"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          <span>Clear all</span>
                        </button>
                      )}
                    </div>
                    {notifications.length === 0 ? (
                      <div className="text-center py-8">
                        <p className="text-muted-foreground text-sm">
                          No new notifications
                        </p>
                      </div>
                    ) : (
                      <div className="divide-y divide-border/50">
                        {notifications.slice(0, 8).map((notif) => (
                          <div
                            key={notif.id}
                            className={`group p-3 text-sm transition-colors ${
                              notif.read
                                ? "bg-white hover:bg-muted/50"
                                : "bg-primary/5 hover:bg-primary/10"
                            }`}
                          >
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex items-start gap-3 flex-1">
                                <div className="mt-0.5 shrink-0">
                                  <div className={`h-2 w-2 rounded-full ${notif.read ? 'bg-muted-foreground/50' : 'bg-primary'}`}></div>
                                </div>
                                <p className="text-foreground/90">{notif.message}</p>
                              </div>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  deleteNotification(notif.id);
                                }}
                                className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-foreground transition-opacity p-1 -m-1"
                                aria-label="Delete notification"
                              >
                                <X className="h-3.5 w-3.5" />
                              </button>
                            </div>
                            <div className="flex items-center justify-between mt-1 pl-5">
                              <span className="text-xs text-muted-foreground">
                                {new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                    {notifications.length > 8 && (
                      <div className="p-3 text-center border-t border-border/50">
                        <button className="text-xs font-medium text-primary hover:underline">
                          View all notifications
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2 text-foreground/90 h-9 px-3 rounded-md bg-muted/50 hover:bg-muted/80 transition-colors cursor-default">
              <User className="h-4 w-4 sm:h-5 sm:w-5 shrink-0" />
              <span className="text-sm font-medium truncate max-w-25 sm:max-w-30 md:max-w-37.5" title={user.name}>
                {user.name}
              </span>
            </div>

            <button
              onClick={logout}
              className="flex items-center justify-center gap-1.5 sm:gap-2 text-foreground/80 hover:text-foreground hover:bg-muted/50 transition-colors px-2.5 sm:px-3 py-1.5 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 focus:ring-offset-card cursor-pointer"
              aria-label="Logout"
            >
              <LogOut className="h-4 w-4 sm:h-5 sm:w-5 shrink-0" />
              <span className="text-sm font-medium hidden sm:inline">
                Logout
              </span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
