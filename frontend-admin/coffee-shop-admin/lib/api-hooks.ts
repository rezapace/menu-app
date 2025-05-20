"use client"

import { useCallback, useEffect, useState } from "react"
import api from "./api"
import type {
  AnalyticsResponse,
  ApiError,
  CreateMenuItemRequest,
  MenuItem,
  Order,
  UpdateMenuItemRequest,
  UpdateOrderStatusRequest,
  UpdatePasswordRequest,
  UpdateProfileRequest,
  UserProfile,
} from "./api-types"

// Generic hook for handling API requests
function useApiRequest<T, P = void>(
  apiFunction: (params: P) => Promise<{ data: T; success: boolean; message?: string }>,
  initialData: T,
  immediate = false,
  initialParams?: P,
) {
  const [data, setData] = useState<T>(initialData)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<ApiError | null>(null)

  const execute = useCallback(
    async (params?: P) => {
      try {
        setIsLoading(true)
        setError(null)
        const response = await apiFunction(params as P)
        setData(response.data)
        return response.data
      } catch (err) {
        const apiError = err as ApiError
        setError(apiError)
        throw apiError
      } finally {
        setIsLoading(false)
      }
    },
    [apiFunction],
  )

  useEffect(() => {
    if (immediate && initialParams !== undefined) {
      execute(initialParams)
    }
  }, [execute, immediate, initialParams])

  return { data, isLoading, error, execute }
}

// Analytics Hooks
export function useAnalyticsSummary() {
  return useApiRequest<AnalyticsResponse, void>(
    () => api.analytics.getSummary(),
    {
      summary: {
        totalRevenue: 0,
        totalOrders: 0,
        totalCustomers: 0,
        popularItem: "",
        popularItemOrders: 0,
        revenueGrowth: 0,
        ordersGrowth: 0,
        customersGrowth: 0,
      },
      salesData: {
        weekly: [],
        monthly: [],
      },
      popularItems: [],
      orderDistribution: [],
    },
    true,
  )
}

// Menu Hooks
export function useMenuItems() {
  return useApiRequest<MenuItem[], void>(() => api.menu.getMenuItems(), [], true)
}

export function useMenuItem(id: string) {
  return useApiRequest<MenuItem, string>((id) => api.menu.getMenuItem(id), {} as MenuItem, true, id)
}

export function useCreateMenuItem() {
  return useApiRequest<MenuItem, CreateMenuItemRequest>((data) => api.menu.createMenuItem(data), {} as MenuItem)
}

export function useUpdateMenuItem() {
  return useApiRequest<MenuItem, UpdateMenuItemRequest>((data) => api.menu.updateMenuItem(data), {} as MenuItem)
}

export function useDeleteMenuItem() {
  return useApiRequest<void, string>((id) => api.menu.deleteMenuItem(id), undefined)
}

// Orders Hooks
export function useOrders(page = 1, limit = 10, status?: string) {
  return useApiRequest<
    { data: Order[]; total: number; page: number; limit: number; totalPages: number },
    { page: number; limit: number; status?: string }
  >(
    (params) => api.orders.getOrders(params.page, params.limit, params.status),
    { data: [], total: 0, page: 1, limit: 10, totalPages: 0 },
    true,
    { page, limit, status },
  )
}

export function useOrder(id: string) {
  return useApiRequest<Order, string>((id) => api.orders.getOrder(id), {} as Order, true, id)
}

export function useUpdateOrderStatus() {
  return useApiRequest<Order, UpdateOrderStatusRequest>((data) => api.orders.updateOrderStatus(data), {} as Order)
}

export function useSearchOrders() {
  return useApiRequest<
    { data: Order[]; total: number; page: number; limit: number; totalPages: number },
    { query: string; page: number; limit: number }
  >((params) => api.orders.searchOrders(params.query, params.page, params.limit), {
    data: [],
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
  })
}

// Profile Hooks
export function useProfile() {
  return useApiRequest<UserProfile, void>(() => api.profile.getProfile(), {} as UserProfile, true)
}

export function useUpdateProfile() {
  return useApiRequest<UserProfile, UpdateProfileRequest>((data) => api.profile.updateProfile(data), {} as UserProfile)
}

export function useUpdatePassword() {
  return useApiRequest<void, UpdatePasswordRequest>((data) => api.profile.updatePassword(data), undefined)
}

// Auth Hooks
export function useLogin() {
  return useApiRequest<{ token: string; user: UserProfile }, { email: string; password: string }>(
    (params) => api.auth.login(params.email, params.password),
    { token: "", user: {} as UserProfile },
  )
}

export function useLogout() {
  return useApiRequest<void, void>(() => api.auth.logout(), undefined)
}
