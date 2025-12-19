/**
 * API client utility for making HTTP requests to the backend
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1"

interface FetchOptions extends RequestInit {
  data?: unknown
}

interface LoginResponse {
  token: string;
  user: {
    id: string;
    email: string;
    name: string;
    // Add other user properties as needed
  };
}

/**
 * Generic API fetch function with automatic token handling
 */
async function apiFetch<T>(endpoint: string, options: FetchOptions = {}): Promise<T> {
  const { data, ...fetchOptions } = options

  const config: RequestInit = {
    ...fetchOptions,
    headers: {
      "Content-Type": "application/json",
      ...fetchOptions.headers,
    },
    credentials: "include", // Include cookies for JWT
  }

  if (data) {
    config.body = JSON.stringify(data)
  }

  try {
    const response = await fetch(`${API_URL}${endpoint}`, config)

    // Parse response data first
    const responseData = await response.json().catch(() => null)

    if (!response.ok) {
      const errorDetails = {
        status: response.status,
        statusText: response.statusText,
        url: response.url,
        error: responseData?.error || responseData?.message || "Request failed",
        details: responseData?.details || responseData,
        responseData,
      }

      console.error("API Error:", errorDetails)

      // Handle different types of errors
      let errorMessage = responseData?.message || "Request failed"

      // If it's a validation error, show detailed message
      if (responseData?.details) {
        errorMessage = `${errorMessage}: ${JSON.stringify(responseData.details)}`
      }

      throw new Error(errorMessage)
    }

    return responseData
  } catch (error) {
    // Re-throw if it's already our formatted error
    if (error instanceof Error) {
      throw error
    }
    // Handle network errors
    throw new Error("Network error occurred")
  }
}

export const api = {
  // Auth
  auth: {
    register: (data: { email: string; password: string; name: string }) =>
      apiFetch("/auth/register", { method: "POST", data }),
    login: (data: { email: string; password: string }): Promise<LoginResponse> => apiFetch<LoginResponse>("/auth/login", { method: "POST", data }),
    logout: () => apiFetch("/auth/logout", { method: "POST" }),
    me: () => apiFetch("/auth/me"),
    updateProfile: (data: { name: string }) => apiFetch("/auth/profile", { method: "PATCH", data }),
  },

  // Tasks
  tasks: {
    getAll: (params?: { status?: string; priority?: string; sortBy?: string }) => {
      const query = params ? `?${new URLSearchParams(params as Record<string, string>).toString()}` : ""
      return apiFetch(`/tasks${query}`)
    },
    getById: (id: string) => apiFetch(`/tasks/${id}`),
    create: (data: unknown) => apiFetch("/tasks", { method: "POST", data }),
    update: (id: string, data: unknown) => apiFetch(`/tasks/${id}`, { method: "PATCH", data }),
    delete: (id: string) => apiFetch(`/tasks/${id}`, { method: "DELETE" }),
    getDashboard: () => apiFetch("/tasks/dashboard/stats"),
  },

  // Notifications
  notifications: {
    getAll: () => apiFetch("/notifications"),
    markAsRead: (id: string) => apiFetch(`/notifications/${id}/read`, { method: "PATCH" }),
    delete: (id: string) => apiFetch(`/notifications/${id}`, { method: "DELETE" }),
    deleteAll: () => apiFetch("/notifications", { method: "DELETE" }),
  },
  
  // Users
  users: {
    getAll: () => apiFetch<{ id: string; name: string; email: string }[]>('/users'),
    getById: (id: string) => apiFetch(`/users/${id}`),
  },
}
