"use client"

import { useState, useEffect } from "react"
import { Edit, MoreHorizontal, Plus, Search, Trash } from "lucide-react"

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
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useMenuItems, useCreateMenuItem, useUpdateMenuItem, useDeleteMenuItem } from "@/lib/api-hooks"
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from "@/components/ui/use-toast"
import type { MenuItem } from "@/lib/api-types"

export default function MenuPage() {
  const { data: menuItemsResponse, isLoading, error, execute: fetchMenuItems } = useMenuItems()
  const { execute: createMenuItem, isLoading: isCreating } = useCreateMenuItem()
  const { execute: updateMenuItem, isLoading: isUpdating } = useUpdateMenuItem()
  const { execute: deleteMenuItem, isLoading: isDeleting } = useDeleteMenuItem()

  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [currentItem, setCurrentItem] = useState<MenuItem | null>(null)
  const [newItem, setNewItem] = useState({
    name: "",
    category: "",
    price: "",
    status: "Available" as "Available" | "Out of Stock",
  })

  // Update local state when API data is loaded
  useEffect(() => {
    if (menuItemsResponse && Array.isArray(menuItemsResponse)) {
      setMenuItems(menuItemsResponse)
    }
  }, [menuItemsResponse])

  // Filter menu items based on search query
  const filteredItems = menuItems.filter(
    (item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  // Add new menu item
  const handleAddItem = async () => {
    try {
      if (!newItem.name || !newItem.category || !newItem.price) {
        toast({
          title: "Validation Error",
          description: "Please fill in all required fields",
          variant: "destructive",
        })
        return
      }

      const createdItem = await createMenuItem({
        name: newItem.name,
        category: newItem.category,
        price: Number.parseFloat(newItem.price),
        status: newItem.status,
      })

      // Update local state
      setMenuItems([...menuItems, createdItem])

      // Reset form and close dialog
      setNewItem({
        name: "",
        category: "",
        price: "",
        status: "Available",
      })
      setIsAddDialogOpen(false)

      toast({
        title: "Success",
        description: "Menu item added successfully",
      })
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to add menu item. Please try again.",
        variant: "destructive",
      })
      console.error("Error adding menu item:", err)
    }
  }

  // Edit menu item
  const handleEditItem = async () => {
    try {
      if (!currentItem) return

      const updatedItem = await updateMenuItem({
        id: currentItem.id,
        name: currentItem.name,
        category: currentItem.category,
        price: currentItem.price,
        status: currentItem.status,
      })

      // Update local state
      const updatedItems = menuItems.map((item) => (item.id === currentItem.id ? updatedItem : item))
      setMenuItems(updatedItems)
      setIsEditDialogOpen(false)

      toast({
        title: "Success",
        description: "Menu item updated successfully",
      })
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to update menu item. Please try again.",
        variant: "destructive",
      })
      console.error("Error updating menu item:", err)
    }
  }

  // Delete menu item
  const handleDeleteItem = async () => {
    try {
      if (!currentItem) return

      await deleteMenuItem(currentItem.id)

      // Update local state
      const updatedItems = menuItems.filter((item) => item.id !== currentItem.id)
      setMenuItems(updatedItems)
      setIsDeleteDialogOpen(false)

      toast({
        title: "Success",
        description: "Menu item deleted successfully",
      })
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to delete menu item. Please try again.",
        variant: "destructive",
      })
      console.error("Error deleting menu item:", err)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Menu Management</h1>
          <p className="text-muted-foreground">Manage your coffee shop menu items</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-amber-600 hover:bg-amber-700 text-white">
              <Plus className="mr-2 h-4 w-4" /> Add Item
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Menu Item</DialogTitle>
              <DialogDescription>Add a new item to your coffee shop menu</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={newItem.name}
                  onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                  placeholder="Item name"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="category">Category</Label>
                <Select value={newItem.category} onValueChange={(value) => setNewItem({ ...newItem, category: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Hot Coffee">Hot Coffee</SelectItem>
                    <SelectItem value="Cold Coffee">Cold Coffee</SelectItem>
                    <SelectItem value="Pastry">Pastry</SelectItem>
                    <SelectItem value="Dessert">Dessert</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="price">Price</Label>
                <Input
                  id="price"
                  value={newItem.price}
                  onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
                  placeholder="0.00"
                  type="number"
                  step="0.01"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={newItem.status}
                  onValueChange={(value: "Available" | "Out of Stock") => setNewItem({ ...newItem, status: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Available">Available</SelectItem>
                    <SelectItem value="Out of Stock">Out of Stock</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button
                className="bg-amber-600 hover:bg-amber-700 text-white"
                onClick={handleAddItem}
                disabled={isCreating}
              >
                {isCreating ? "Adding..." : "Add Item"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Menu Items</CardTitle>
          <CardDescription>Manage your coffee and food items</CardDescription>
          <div className="flex items-center py-2">
            <Search className="mr-2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search menu items..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="max-w-sm"
            />
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
              <p>Error loading menu items. Please try again.</p>
              <Button variant="outline" onClick={() => fetchMenuItems()} className="mt-2">
                Retry
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[80px]">Image</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredItems.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-4 text-muted-foreground">
                      No menu items found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredItems.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <img
                          src={item.image || "/placeholder.svg?height=50&width=50"}
                          alt={item.name}
                          className="h-10 w-10 rounded-md object-cover"
                        />
                      </TableCell>
                      <TableCell className="font-medium">{item.name}</TableCell>
                      <TableCell>{item.category}</TableCell>
                      <TableCell>${item.price.toFixed(2)}</TableCell>
                      <TableCell>
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                            item.status === "Available" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                          }`}
                        >
                          {item.status}
                        </span>
                      </TableCell>
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
                            <Dialog
                              open={isEditDialogOpen && currentItem?.id === item.id}
                              onOpenChange={(open) => {
                                setIsEditDialogOpen(open)
                                if (!open) setCurrentItem(null)
                              }}
                            >
                              <DialogTrigger asChild>
                                <DropdownMenuItem
                                  onSelect={(e) => {
                                    e.preventDefault()
                                    setCurrentItem(item)
                                  }}
                                >
                                  <Edit className="mr-2 h-4 w-4" />
                                  Edit
                                </DropdownMenuItem>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Edit Menu Item</DialogTitle>
                                  <DialogDescription>Make changes to the menu item</DialogDescription>
                                </DialogHeader>
                                {currentItem && (
                                  <div className="grid gap-4 py-4">
                                    <div className="grid gap-2">
                                      <Label htmlFor="edit-name">Name</Label>
                                      <Input
                                        id="edit-name"
                                        value={currentItem.name}
                                        onChange={(e) =>
                                          setCurrentItem({
                                            ...currentItem,
                                            name: e.target.value,
                                          })
                                        }
                                      />
                                    </div>
                                    <div className="grid gap-2">
                                      <Label htmlFor="edit-category">Category</Label>
                                      <Select
                                        value={currentItem.category}
                                        onValueChange={(value) =>
                                          setCurrentItem({
                                            ...currentItem,
                                            category: value,
                                          })
                                        }
                                      >
                                        <SelectTrigger>
                                          <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                          <SelectItem value="Hot Coffee">Hot Coffee</SelectItem>
                                          <SelectItem value="Cold Coffee">Cold Coffee</SelectItem>
                                          <SelectItem value="Pastry">Pastry</SelectItem>
                                          <SelectItem value="Dessert">Dessert</SelectItem>
                                        </SelectContent>
                                      </Select>
                                    </div>
                                    <div className="grid gap-2">
                                      <Label htmlFor="edit-price">Price</Label>
                                      <Input
                                        id="edit-price"
                                        value={currentItem.price}
                                        onChange={(e) =>
                                          setCurrentItem({
                                            ...currentItem,
                                            price: Number.parseFloat(e.target.value),
                                          })
                                        }
                                        type="number"
                                        step="0.01"
                                      />
                                    </div>
                                    <div className="grid gap-2">
                                      <Label htmlFor="edit-status">Status</Label>
                                      <Select
                                        value={currentItem.status}
                                        onValueChange={(value: "Available" | "Out of Stock") =>
                                          setCurrentItem({
                                            ...currentItem,
                                            status: value,
                                          })
                                        }
                                      >
                                        <SelectTrigger>
                                          <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                          <SelectItem value="Available">Available</SelectItem>
                                          <SelectItem value="Out of Stock">Out of Stock</SelectItem>
                                        </SelectContent>
                                      </Select>
                                    </div>
                                  </div>
                                )}
                                <DialogFooter>
                                  <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                                    Cancel
                                  </Button>
                                  <Button
                                    className="bg-amber-600 hover:bg-amber-700 text-white"
                                    onClick={handleEditItem}
                                    disabled={isUpdating}
                                  >
                                    {isUpdating ? "Saving..." : "Save Changes"}
                                  </Button>
                                </DialogFooter>
                              </DialogContent>
                            </Dialog>
                            <Dialog
                              open={isDeleteDialogOpen && currentItem?.id === item.id}
                              onOpenChange={(open) => {
                                setIsDeleteDialogOpen(open)
                                if (!open) setCurrentItem(null)
                              }}
                            >
                              <DialogTrigger asChild>
                                <DropdownMenuItem
                                  onSelect={(e) => {
                                    e.preventDefault()
                                    setCurrentItem(item)
                                  }}
                                >
                                  <Trash className="mr-2 h-4 w-4" />
                                  Delete
                                </DropdownMenuItem>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Confirm Deletion</DialogTitle>
                                  <DialogDescription>
                                    Are you sure you want to delete this menu item? This action cannot be undone.
                                  </DialogDescription>
                                </DialogHeader>
                                <DialogFooter>
                                  <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                                    Cancel
                                  </Button>
                                  <Button variant="destructive" onClick={handleDeleteItem} disabled={isDeleting}>
                                    {isDeleting ? "Deleting..." : "Delete"}
                                  </Button>
                                </DialogFooter>
                              </DialogContent>
                            </Dialog>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
