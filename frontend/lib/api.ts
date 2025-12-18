
import type { User } from '@/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

interface FetchOptions extends RequestInit {
  data?: unknown;
}

async function apiFetch<T>(
  endpoint: string,
  options: FetchOptions = {}
): Promise<T> {
  const { data, ...fetchOptions } = options;
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  const config: RequestInit = {
    ...fetchOptions,
    headers: {
      "Content-Type": "application/json",
      ...(token && { "Authorization": `Bearer ${token}` }),
      ...fetchOptions.headers,
    },
    credentials: "include",
  };

  if (data) {
    config.body = JSON.stringify(data);
  }

  const response = await fetch(`${API_URL}${endpoint}`, config);

  if (!response.ok) {
    const error = await response
      .json()
      .catch(() => ({
        message: `HTTP error! status: ${response.status}`,
        status: response.status,
      }));
    
    console.error('API Error:', {
      status: response.status,
      statusText: response.statusText,
      url: response.url,
      error
    });
    
    // Handle validation errors or other API-specific error formats
    const errorMessage = error.message || 
                        error.error?.message || 
                        (typeof error === 'string' ? error : 'Request failed');
    
    const apiError = new Error(errorMessage);
    (apiError as any).status = error.status || response.status;
    (apiError as any).details = error.errors || error.error?.details;
    
    throw apiError;
  }

  // Handle 204 No Content responses
  if (response.status === 204) {
    return null as unknown as T;
  }

  try {
    return await response.json();
  } catch (error) {
    if (error instanceof Error) {
      console.error('Failed to parse JSON response:', error.message);
    }
    return null as unknown as T;
  }
}

export const api = {
  users: {
    getAll: (): Promise<Array<{ id: string; name: string }>> => 
      apiFetch('/users'),
  },
  auth: {
    register: (data: { email: string; password: string; name: string }) =>
      apiFetch("/auth/register", { method: "POST", data }),
    login: (data: { email: string; password: string }): Promise<{ token: string; user: User }> =>
      apiFetch<{ token: string; user: User }>("/auth/login", { method: "POST", data }),
    logout: () => apiFetch("/auth/logout", { method: "POST" }),
    me: () => apiFetch("/auth/me"),
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
    deleteAll: () =>
      apiFetch("/notifications", { method: "DELETE" }),
  },
};
