"use client"

import { useState } from "react"
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

// Sample orders data
const initialOrders = [
  {
    id: "ORD-001",
    customer: "John Doe",
    date: "2023-05-15 09:30 AM",
    items: [
      { name: "Espresso", quantity: 1, price: 3.99 },
      { name: "Croissant", quantity: 1, price: 3.49 },
    ],
    total: 7.48,
    status: "Completed",
    paymentMethod: "Credit Card",
  },
  {
    id: "ORD-002",
    customer: "Jane Smith",
    date: "2023-05-15 10:15 AM",
    items: [
      { name: "Cappuccino", quantity: 2, price: 4.99 },
      { name: "Chocolate Muffin", quantity: 1, price: 3.99 },
    ],
    total: 13.97,
    status: "Completed",
    paymentMethod: "Cash",
  },
  {
    id: "ORD-003",
    customer: "Michael Johnson",
    date: "2023-05-15 11:00 AM",
    items: [
      { name: "Latte", quantity: 1, price: 4.49 },
      { name: "Cold Brew", quantity: 1, price: 4.99 },
    ],
    total: 9.48,
    status: "In Progress",
    paymentMethod: "Credit Card",
  },
  {
    id: "ORD-004",
    customer: "Emily Davis",
    date: "2023-05-15 11:45 AM",
    items: [
      { name: "Mocha", quantity: 1, price: 5.49 },
      { name: "Croissant", quantity: 2, price: 3.49 },
    ],
    total: 12.47,
    status: "In Progress",
    paymentMethod: "Mobile Payment",
  },
  {
    id: "ORD-005",
    customer: "David Wilson",
    date: "2023-05-15 12:30 PM",
    items: [
      { name: "Espresso", quantity: 2, price: 3.99 },
      { name: "Chocolate Muffin", quantity: 1, price: 3.99 },
    ],
    total: 11.97,
    status: "Pending",
    paymentMethod: "Credit Card",
  },
  {
    id: "ORD-006",
    customer: "Sarah Brown",
    date: "2023-05-15 01:15 PM",
    items: [
      { name: "Cold Brew", quantity: 1, price: 4.99 },
      { name: "Iced Latte", quantity: 1, price: 4.99 },
    ],
    total: 9.98,
    status: "Pending",
    paymentMethod: "Cash",
  },
  {
    id: "ORD-007",
    customer: "Robert Taylor",
    date: "2023-05-15 02:00 PM",
    items: [
      { name: "Cappuccino", quantity: 1, price: 4.99 },
      { name: "Latte", quantity: 1, price: 4.49 },
    ],
    total: 9.48,
    status: "Cancelled",
    paymentMethod: "Credit Card",
  },
]

export default function OrdersPage() {
  const [orders, setOrders] = useState(initialOrders)
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("all")
  const [viewOrderDetails, setViewOrderDetails] = useState<any>(null)
  const [updateOrderStatus, setUpdateOrderStatus] = useState<any>(null)

  // Filter orders based on search query and active tab
  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer.toLowerCase().includes(searchQuery.toLowerCase())

    if (activeTab === "all") return matchesSearch
    return matchesSearch && order.status.toLowerCase() === activeTab.toLowerCase()
  })

  // Update order status
  const handleUpdateStatus = () => {
    const updatedOrders = orders.map((order) =>
      order.id === updateOrderStatus.id ? { ...order, status: updateOrderStatus.newStatus } : order,
    )
    setOrders(updatedOrders)
    setUpdateOrderStatus(null)
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
                className="max-w-sm"
              />
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
              {filteredOrders.map((order) => (
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
                          onClick={() => setUpdateOrderStatus({ id: order.id, newStatus: order.status })}
                        >
                          <Clock className="mr-2 h-4 w-4" />
                          Update Status
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
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
                  {viewOrderDetails.items.map((item: any, index: number) => (
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
                  value={updateOrderStatus.newStatus}
                  onValueChange={(value) =>
                    setUpdateOrderStatus({
                      ...updateOrderStatus,
                      newStatus: value,
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
            <Button className="bg-amber-600 hover:bg-amber-700 text-white" onClick={handleUpdateStatus}>
              Update Status
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
