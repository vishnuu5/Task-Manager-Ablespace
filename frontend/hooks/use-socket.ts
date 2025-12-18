"use client";

import { useEffect } from "react";
import { getSocket } from "@/lib/socket";
import { mutate } from "swr";

export function useSocketEvents() {
  useEffect(() => {
    const socket = getSocket();

    socket.on("task:created", () => {
      mutate((key) => typeof key === "string" && key.startsWith("/tasks"));
    });

    socket.on("task:updated", () => {
      mutate((key) => typeof key === "string" && key.startsWith("/tasks"));
    });

    socket.on("task:deleted", () => {
      mutate((key) => typeof key === "string" && key.startsWith("/tasks"));
    });

    socket.on("task:assigned", () => {
      mutate((key) => typeof key === "string" && key.startsWith("/tasks"));
      mutate("/notifications");
    });

    socket.on("notification:new", () => {
      mutate("/notifications");
    });

    return () => {
      socket.off("task:created");
      socket.off("task:updated");
      socket.off("task:deleted");
      socket.off("task:assigned");
      socket.off("notification:new");
    };
  }, []);
}
