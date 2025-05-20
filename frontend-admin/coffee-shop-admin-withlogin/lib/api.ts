import type {
  AnalyticsResponse,
  ApiError,
  ApiResponse,
  CreateMenuItemRequest,
  MenuItem,
  Order,
  PaginatedResponse,
  UpdateMenuItemRequest,
  UpdateOrderStatusRequest,
  UpdatePasswordRequest,
  UpdateProfileRequest,
  UserProfile,
} from "./api-types"

// Configuration - Replace with your actual API URL when ready
const API_BASE_URL = "/api"

// Helper function to handle API responses
async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const errorData = await response.json()
    const error: ApiError = {
      message: errorData.message || "An error occurred",
      code: errorData.code,
      details: errorData.details,
    }
    throw error
  }

  return await response.json()
}

// Generic fetch function with error handling
async function fetchApi<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  try {
    const url = `${API_BASE_URL}${endpoint}`
    const headers = {
      "Content-Type": "application/json",
      ...options.headers,
    }

    const response = await fetch(url, {
      ...options,
      headers,
    })

    return await handleResponse<T>(response)
  } catch (error) {
    console.error("API Error:", error)
    throw error
  }
}

// Analytics API
export const analyticsApi = {
  getSummary: async (): Promise<ApiResponse<AnalyticsResponse>> => {
    return fetchApi<ApiResponse<AnalyticsResponse>>("/analytics/summary")
  },
}

// Menu API
export const menuApi = {
  getMenuItems: async (): Promise<ApiResponse<MenuItem[]>> => {
    return fetchApi<ApiResponse<MenuItem[]>>("/menu")
  },

  getMenuItem: async (id: string): Promise<ApiResponse<MenuItem>> => {
    return fetchApi<ApiResponse<MenuItem>>(`/menu/${id}`)
  },

  createMenuItem: async (data: CreateMenuItemRequest): Promise<ApiResponse<MenuItem>> => {
    return fetchApi<ApiResponse<MenuItem>>("/menu", {
      method: "POST",
      body: JSON.stringify(data),
    })
  },

  updateMenuItem: async (data: UpdateMenuItemRequest): Promise<ApiResponse<MenuItem>> => {
    return fetchApi<ApiResponse<MenuItem>>(`/menu/${data.id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    })
  },

  deleteMenuItem: async (id: string): Promise<ApiResponse<void>> => {
    return fetchApi<ApiResponse<void>>(`/menu/${id}`, {
      method: "DELETE",
    })
  },

  uploadMenuItemImage: async (id: string, file: File): Promise<ApiResponse<{ imageUrl: string }>> => {
    const formData = new FormData()
    formData.append("image", file)

    return fetch(`${API_BASE_URL}/menu/${id}/image`, {
      method: "POST",
      body: formData,
    }).then((response) => handleResponse(response))
  },
}

// Orders API
export const ordersApi = {
  getOrders: async (page = 1, limit = 10, status?: string): Promise<ApiResponse<PaginatedResponse<Order>>> => {
    const queryParams = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    })

    if (status && status !== "all") {
      queryParams.append("status", status)
    }

    return fetchApi<ApiResponse<PaginatedResponse<Order>>>(`/orders?${queryParams.toString()}`)
  },

  getOrder: async (id: string): Promise<ApiResponse<Order>> => {
    return fetchApi<ApiResponse<Order>>(`/orders/${id}`)
  },

  updateOrderStatus: async (data: UpdateOrderStatusRequest): Promise<ApiResponse<Order>> => {
    return fetchApi<ApiResponse<Order>>(`/orders/${data.id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status: data.status }),
    })
  },

  searchOrders: async (query: string, page = 1, limit = 10): Promise<ApiResponse<PaginatedResponse<Order>>> => {
    const queryParams = new URLSearchParams({
      q: query,
      page: page.toString(),
      limit: limit.toString(),
    })

    return fetchApi<ApiResponse<PaginatedResponse<Order>>>(`/orders/search?${queryParams.toString()}`)
  },
}

// User Profile API
export const profileApi = {
  getProfile: async (): Promise<ApiResponse<UserProfile>> => {
    return fetchApi<ApiResponse<UserProfile>>("/profile")
  },

  updateProfile: async (data: UpdateProfileRequest): Promise<ApiResponse<UserProfile>> => {
    return fetchApi<ApiResponse<UserProfile>>("/profile", {
      method: "PUT",
      body: JSON.stringify(data),
    })
  },

  updatePassword: async (data: UpdatePasswordRequest): Promise<ApiResponse<void>> => {
    return fetchApi<ApiResponse<void>>("/profile/password", {
      method: "PUT",
      body: JSON.stringify(data),
    })
  },

  uploadAvatar: async (file: File): Promise<ApiResponse<{ avatarUrl: string }>> => {
    const formData = new FormData()
    formData.append("avatar", file)

    return fetch(`${API_BASE_URL}/profile/avatar`, {
      method: "POST",
      body: formData,
    }).then((response) => handleResponse(response))
  },
}

// Authentication API
export const authApi = {
  login: async (email: string, password: string): Promise<ApiResponse<{ token: string; user: UserProfile }>> => {
    return fetchApi<ApiResponse<{ token: string; user: UserProfile }>>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    })
  },

  logout: async (): Promise<ApiResponse<void>> => {
    return fetchApi<ApiResponse<void>>("/auth/logout", {
      method: "POST",
    })
  },

  refreshToken: async (): Promise<ApiResponse<{ token: string }>> => {
    return fetchApi<ApiResponse<{ token: string }>>("/auth/refresh", {
      method: "POST",
    })
  },
}

// Export a default API object with all services
const api = {
  analytics: analyticsApi,
  menu: menuApi,
  orders: ordersApi,
  profile: profileApi,
  auth: authApi,
}

export default api
