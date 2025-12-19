const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

interface FetchOptions extends RequestInit {
  data?: unknown;
}

interface LoginResponse {
  token: string;
  user: {
    id: string;
    email: string;
    name: string;
  };
}

const handleUnauthorized = () => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("token");
    if (!window.location.pathname.includes("/login")) {
      window.location.href = "/login";
    }
  }
};

async function apiFetch<T>(
  endpoint: string,
  options: FetchOptions = {}
): Promise<T> {
  const { data, ...fetchOptions } = options;
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const config: RequestInit = {
    ...fetchOptions,
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...fetchOptions.headers,
    },
    credentials: "include",
  };

  if (data) {
    config.body = JSON.stringify(data);
  }

  try {
    const response = await fetch(`${API_URL}${endpoint}`, config);
    const responseData = await response.json().catch(() => ({}));

    if (response.status === 401) {
      handleUnauthorized();
      throw new Error("Session expired. Please log in again.");
    }

    if (!response.ok) {
      throw new Error(responseData.message || "Something went wrong");
    }

    return responseData;
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
}

export const api = {
  auth: {
    register: (data: { email: string; password: string; name: string }) =>
      apiFetch("/auth/register", { method: "POST", data }),

    login: async (data: {
      email: string;
      password: string;
    }): Promise<LoginResponse> => {
      const response = await apiFetch<LoginResponse>("/auth/login", {
        method: "POST",
        data,
      });
      if (response?.token) {
        localStorage.setItem("token", response.token);
      }
      return response;
    },

    logout: async () => {
      localStorage.removeItem("token");
      return apiFetch("/auth/logout", { method: "POST" });
    },

    me: () => apiFetch<LoginResponse>("/auth/me"),

    updateProfile: (data: { name: string }) =>
      apiFetch("/auth/profile", { method: "PATCH", data }),
  },

  tasks: {
    getAll: (params?: {
      status?: string;
      priority?: string;
      sortBy?: string;
    }) => {
      const query = params
        ? `?${new URLSearchParams(params as Record<string, string>).toString()}`
        : "";
      return apiFetch(`/tasks${query}`);
    },

    getById: (id: string) => apiFetch(`/tasks/${id}`),

    create: (data: unknown) => apiFetch("/tasks", { method: "POST", data }),

    update: (id: string, data: unknown) =>
      apiFetch(`/tasks/${id}`, { method: "PATCH", data }),

    delete: (id: string) => apiFetch(`/tasks/${id}`, { method: "DELETE" }),

    getDashboard: () => apiFetch("/tasks/dashboard/stats"),
  },
  notifications: {
    getAll: () => apiFetch("/notifications"),

    markAsRead: (id: string) =>
      apiFetch(`/notifications/${id}/read`, { method: "PATCH" }),

    delete: (id: string) =>
      apiFetch(`/notifications/${id}`, { method: "DELETE" }),

    deleteAll: () => apiFetch("/notifications", { method: "DELETE" }),
  },

  users: {
    getAll: () => apiFetch("/users"),
    getById: (id: string) => apiFetch(`/users/${id}`),
  },
};
