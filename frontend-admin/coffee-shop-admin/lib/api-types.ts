// Types for API requests and responses

// Analytics Types
export interface SalesData {
  name: string
  sales: number
  customers: number
  orders: number
}

export interface PopularItem {
  name: string
  orders: number
  percentage: number
}

export interface AnalyticsSummary {
  totalRevenue: number
  totalOrders: number
  totalCustomers: number
  popularItem: string
  popularItemOrders: number
  revenueGrowth: number
  ordersGrowth: number
  customersGrowth: number
}

export interface AnalyticsResponse {
  summary: AnalyticsSummary
  salesData: {
    weekly: SalesData[]
    monthly: SalesData[]
  }
  popularItems: PopularItem[]
  orderDistribution: {
    time: string
    orders: number
  }[]
}

// Menu Types
export interface MenuItem {
  id: string
  name: string
  category: string
  price: number
  status: "Available" | "Out of Stock"
  image: string
}

export interface CreateMenuItemRequest {
  name: string
  category: string
  price: number
  status: "Available" | "Out of Stock"
  image?: string
}

export interface UpdateMenuItemRequest {
  id: string
  name?: string
  category?: string
  price?: number
  status?: "Available" | "Out of Stock"
  image?: string
}

// Order Types
export interface OrderItem {
  name: string
  quantity: number
  price: number
}

export interface Order {
  id: string
  customer: string
  date: string
  items: OrderItem[]
  total: number
  status: "Pending" | "In Progress" | "Completed" | "Cancelled"
  paymentMethod: string
}

export interface UpdateOrderStatusRequest {
  id: string
  status: "Pending" | "In Progress" | "Completed" | "Cancelled"
}

// User Profile Types
export interface UserProfile {
  name: string
  email: string
  phone: string
  role: string
  bio: string
  avatar?: string
  notifications: {
    email: boolean
    push: boolean
    orders: boolean
    marketing: boolean
  }
}

export interface UpdateProfileRequest {
  name?: string
  email?: string
  phone?: string
  role?: string
  bio?: string
  avatar?: string
  notifications?: {
    email?: boolean
    push?: boolean
    orders?: boolean
    marketing?: boolean
  }
}

export interface UpdatePasswordRequest {
  currentPassword: string
  newPassword: string
}

// API Response Types
export interface ApiResponse<T> {
  data: T
  success: boolean
  message?: string
}

export interface ApiError {
  message: string
  code?: string
  details?: any
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}
