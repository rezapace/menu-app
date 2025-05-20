"use client"

import { useState, useEffect } from "react"
import { Calendar, Check, Clock, Eye, MoreHorizontal, Search, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useOrders, useUpdateOrderStatus, useSearchOrders } from "@/lib/api-hooks"
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from "@/components/ui/use-toast"
import type { Order, UpdateOrderStatusRequest } from "@/lib/api-types"

export default function OrdersPage() {
  const [activeTab, setActiveTab] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [viewOrderDetails, setViewOrderDetails] = useState<Order | null>(null)
  const [updateOrderStatus, setUpdateOrderStatus] = useState<UpdateOrderStatusRequest | null>(null)
  const [page, setPage] = useState(1)
  const [limit] = useState(10)

  // API hooks
  const {
    data: ordersResponse,
    isLoading,
    error,
    execute: fetchOrders,
  } = useOrders(page, limit, activeTab !== "all" ? activeTab : undefined)

  const { execute: searchOrdersExecute, isLoading: isSearching } = useSearchOrders()

  const { execute: updateOrderStatusExecute, isLoading: isUpdatingStatus } = useUpdateOrderStatus()

  const [orders, setOrders] = useState<Order[]>([])
  const [totalOrders, setTotalOrders] = useState(0)
  const [totalPages, setTotalPages] = useState(0)

  // Load orders when tab changes or page changes
  useEffect(() => {
    fetchOrders({ page, limit, status: activeTab !== "all" ? activeTab : undefined })
  }, [activeTab, page, fetchOrders, limit])

  // Update local state when API data is loaded
  useEffect(() => {
    if (ordersResponse) {
      setOrders(ordersResponse.data || [])
      setTotalOrders(ordersResponse.total || 0)
      setTotalPages(ordersResponse.totalPages || 0)
    }
  }, [ordersResponse])

  // Handle search
  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      // If search is cleared, revert to normal listing
      fetchOrders({ page: 1, limit, status: activeTab !== "all" ? activeTab : undefined })
      return
    }

    try {
      const result = await searchOrdersExecute({
        query: searchQuery,
        page: 1,
        limit,
      })

      if (result) {
        setOrders(result.data || [])
        setTotalOrders(result.total || 0)
        setTotalPages(result.totalPages || 0)
        setPage(1) // Reset to first page on search
      }
    } catch (err) {
      toast({
        title: "Search Error",
        description: "Failed to search orders. Please try again.",
        variant: "destructive",
      })
      console.error("Error searching orders:", err)
    }
  }

  // Handle status update
  const handleUpdateStatus = async () => {
    if (!updateOrderStatus) return

    try {
      const updatedOrder = await updateOrderStatusExecute(updateOrderStatus)

      // Update the order in the local state
      const updatedOrders = orders.map((order) => (order.id === updatedOrder.id ? updatedOrder : order))

      setOrders(updatedOrders)
      setUpdateOrderStatus(null)

      toast({
        title: "Status Updated",
        description: `Order ${updatedOrder.id} status changed to ${updatedOrder.status}`,
      })
    } catch (err) {
      toast({
        title: "Update Error",
        description: "Failed to update order status. Please try again.",
        variant: "destructive",
      })
      console.error("Error updating order status:", err)
    }
  }

  // Get status badge color
  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "bg-green-100 text-green-800"
      case "in progress":
        return "bg-blue-100 text-blue-800"
      case "pending":
        return "bg-amber-100 text-amber-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  // Get status icon
  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return <Check className="h-4 w-4" />
      case "in progress":
        return <Clock className="h-4 w-4" />
      case "pending":
        return <Calendar className="h-4 w-4" />
      case "cancelled":
        return <X className="h-4 w-4" />
      default:
        return null
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Order Management</h1>
        <p className="text-muted-foreground">Manage and track customer orders</p>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Orders</CardTitle>
          <CardDescription>View and manage all customer orders</CardDescription>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-2">
            <div className="flex items-center">
              <Search className="mr-2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search orders..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                className="max-w-sm"
              />
              <Button variant="ghost" size="sm" onClick={handleSearch} disabled={isSearching} className="ml-2">
                {isSearching ? "Searching..." : "Search"}
              </Button>
            </div>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full sm:w-auto">
              <TabsList className="grid grid-cols-4 w-full sm:w-auto">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="pending">Pending</TabsTrigger>
                <TabsTrigger value="in progress">In Progress</TabsTrigger>
                <TabsTrigger value="completed">Completed</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-4 text-red-500">
              <p>Error loading orders. Please try again.</p>
              <Button
                variant="outline"
                onClick={() => fetchOrders({ page, limit, status: activeTab !== "all" ? activeTab : undefined })}
                className="mt-2"
              >
                Retry
              </Button>
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead className="hidden md:table-cell">Date</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="hidden md:table-cell">Payment</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-4 text-muted-foreground">
                        No orders found
                      </TableCell>
                    </TableRow>
                  ) : (
                    orders.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell className="font-medium">{order.id}</TableCell>
                        <TableCell>{order.customer}</TableCell>
                        <TableCell className="hidden md:table-cell">{order.date}</TableCell>
                        <TableCell className="text-right">${order.total.toFixed(2)}</TableCell>
                        <TableCell>
                          <span
                            className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusBadge(
                              order.status,
                            )}`}
                          >
                            {getStatusIcon(order.status)}
                            {order.status}
                          </span>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">{order.paymentMethod}</TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">Actions</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem onClick={() => setViewOrderDetails(order)}>
                                <Eye className="mr-2 h-4 w-4" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => setUpdateOrderStatus({ id: order.id, status: order.status })}
                              >
                                <Clock className="mr-2 h-4 w-4" />
                                Update Status
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-end space-x-2 py-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                    disabled={page === 1 || isLoading}
                  >
                    Previous
                  </Button>
                  <div className="text-sm text-muted-foreground">
                    Page {page} of {totalPages}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
                    disabled={page === totalPages || isLoading}
                  >
                    Next
                  </Button>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* View Order Details Dialog */}
      <Dialog open={!!viewOrderDetails} onOpenChange={(open) => !open && setViewOrderDetails(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Order Details</DialogTitle>
            <DialogDescription>
              Order {viewOrderDetails?.id} - {viewOrderDetails?.customer}
            </DialogDescription>
          </DialogHeader>
          {viewOrderDetails && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Date</p>
                  <p>{viewOrderDetails.date}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Status</p>
                  <span
                    className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusBadge(
                      viewOrderDetails.status,
                    )}`}
                  >
                    {getStatusIcon(viewOrderDetails.status)}
                    {viewOrderDetails.status}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Payment Method</p>
                  <p>{viewOrderDetails.paymentMethod}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total</p>
                  <p className="font-medium">${viewOrderDetails.total.toFixed(2)}</p>
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-2">Items</p>
                <div className="space-y-2">
                  {viewOrderDetails.items.map((item, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <span>
                        {item.quantity}x {item.name}
                      </span>
                      <span>${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setViewOrderDetails(null)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Update Order Status Dialog */}
      <Dialog open={!!updateOrderStatus} onOpenChange={(open) => !open && setUpdateOrderStatus(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Update Order Status</DialogTitle>
            <DialogDescription>Change the status of this order</DialogDescription>
          </DialogHeader>
          {updateOrderStatus && (
            <div className="space-y-4 py-2">
              <div className="space-y-2">
                <p className="text-sm font-medium">Current Status</p>
                <span
                  className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusBadge(
                    orders.find((o) => o.id === updateOrderStatus.id)?.status || "",
                  )}`}
                >
                  {getStatusIcon(orders.find((o) => o.id === updateOrderStatus.id)?.status || "")}
                  {orders.find((o) => o.id === updateOrderStatus.id)?.status}
                </span>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium">New Status</p>
                <Select
                  value={updateOrderStatus.status}
                  onValueChange={(value) =>
                    setUpdateOrderStatus({
                      ...updateOrderStatus,
                      status: value as "Pending" | "In Progress" | "Completed" | "Cancelled",
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Pending">Pending</SelectItem>
                    <SelectItem value="In Progress">In Progress</SelectItem>
                    <SelectItem value="Completed">Completed</SelectItem>
                    <SelectItem value="Cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setUpdateOrderStatus(null)}>
              Cancel
            </Button>
            <Button
              className="bg-amber-600 hover:bg-amber-700 text-white"
              onClick={handleUpdateStatus}
              disabled={isUpdatingStatus}
            >
              {isUpdatingStatus ? "Updating..." : "Update Status"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
