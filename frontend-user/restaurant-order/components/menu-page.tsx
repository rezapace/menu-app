"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Minus, ShoppingCart, ArrowLeft, X, Utensils, Coffee } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

// Sample menu data
const menuItems = [
  {
    id: 1,
    name: "Beef Burger",
    price: 12.99,
    type: "food",
    image: "/placeholder.svg?height=200&width=200",
    description: "Juicy beef patty with fresh vegetables and special sauce",
  },
  {
    id: 2,
    name: "Chicken Pasta",
    price: 10.99,
    type: "food",
    image: "/placeholder.svg?height=200&width=200",
    description: "Creamy pasta with grilled chicken and parmesan",
  },
  {
    id: 3,
    name: "Caesar Salad",
    price: 8.99,
    type: "food",
    image: "/placeholder.svg?height=200&width=200",
    description: "Fresh romaine lettuce with caesar dressing and croutons",
  },
  {
    id: 4,
    name: "Margherita Pizza",
    price: 14.99,
    type: "food",
    image: "/placeholder.svg?height=200&width=200",
    description: "Classic pizza with tomato sauce, mozzarella and basil",
  },
  {
    id: 5,
    name: "Iced Coffee",
    price: 4.99,
    type: "drink",
    image: "/placeholder.svg?height=200&width=200",
    description: "Refreshing cold coffee with a hint of vanilla",
  },
  {
    id: 6,
    name: "Orange Juice",
    price: 3.99,
    type: "drink",
    image: "/placeholder.svg?height=200&width=200",
    description: "Freshly squeezed orange juice",
  },
  {
    id: 7,
    name: "Strawberry Smoothie",
    price: 5.99,
    type: "drink",
    image: "/placeholder.svg?height=200&width=200",
    description: "Creamy smoothie with fresh strawberries and yogurt",
  },
  {
    id: 8,
    name: "Mineral Water",
    price: 2.99,
    type: "drink",
    image: "/placeholder.svg?height=200&width=200",
    description: "Pure mineral water from mountain springs",
  },
]

type MenuPageProps = {
  cart: {
    items: {
      id: number
      name: string
      price: number
      quantity: number
      type: "food" | "drink"
      image: string
    }[]
    totalItems: number
    totalPrice: number
  }
  setCart: React.Dispatch<
    React.SetStateAction<{
      items: {
        id: number
        name: string
        price: number
        quantity: number
        type: "food" | "drink"
        image: string
      }[]
      totalItems: number
      totalPrice: number
    }>
  >
  onPlaceOrder: () => void
  onBack: () => void
  onCancel: () => void
}

export default function MenuPage({ cart, setCart, onPlaceOrder, onBack, onCancel }: MenuPageProps) {
  const [activeTab, setActiveTab] = useState("food")
  const [addedItemId, setAddedItemId] = useState<number | null>(null)
  const menuRef = useRef<HTMLDivElement>(null)

  const addToCart = (item: (typeof menuItems)[0]) => {
    setAddedItemId(item.id)
    setTimeout(() => setAddedItemId(null), 500)

    setCart((prevCart) => {
      const existingItem = prevCart.items.find((cartItem) => cartItem.id === item.id)

      if (existingItem) {
        // Item already in cart, increase quantity
        const updatedItems = prevCart.items.map((cartItem) =>
          cartItem.id === item.id ? { ...cartItem, quantity: cartItem.quantity + 1 } : cartItem,
        )

        return {
          items: updatedItems,
          totalItems: prevCart.totalItems + 1,
          totalPrice: prevCart.totalPrice + item.price,
        }
      } else {
        // Add new item to cart
        return {
          items: [...prevCart.items, { ...item, quantity: 1 }],
          totalItems: prevCart.totalItems + 1,
          totalPrice: prevCart.totalPrice + item.price,
        }
      }
    })
  }

  const removeFromCart = (itemId: number) => {
    setCart((prevCart) => {
      const itemToRemove = prevCart.items.find((item) => item.id === itemId)

      if (!itemToRemove) return prevCart

      if (itemToRemove.quantity > 1) {
        // Decrease quantity
        const updatedItems = prevCart.items.map((item) =>
          item.id === itemId ? { ...item, quantity: item.quantity - 1 } : item,
        )

        return {
          items: updatedItems,
          totalItems: prevCart.totalItems - 1,
          totalPrice: prevCart.totalPrice - itemToRemove.price,
        }
      } else {
        // Remove item completely
        return {
          items: prevCart.items.filter((item) => item.id !== itemId),
          totalItems: prevCart.totalItems - 1,
          totalPrice: prevCart.totalPrice - itemToRemove.price,
        }
      }
    })
  }

  const getItemQuantity = (itemId: number) => {
    const item = cart.items.find((item) => item.id === itemId)
    return item ? item.quantity : 0
  }

  // Scroll to top when tab changes
  useEffect(() => {
    if (menuRef.current) {
      menuRef.current.scrollTop = 0
    }
  }, [activeTab])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 24,
      },
    },
  }

  return (
    <div className="relative pb-24 bg-white rounded-3xl shadow-lg overflow-hidden">
      <div className="bg-gradient-to-r from-orange-400 to-red-500 p-4 flex items-center justify-between text-white">
        <Button
          variant="ghost"
          size="icon"
          onClick={onBack}
          className="text-white hover:bg-white/20 rounded-full h-10 w-10"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-xl font-bold">Our Menu</h1>
        <Button
          variant="ghost"
          size="icon"
          onClick={onCancel}
          className="text-white hover:bg-white/20 rounded-full h-10 w-10"
        >
          <X className="h-5 w-5" />
        </Button>
      </div>

      <Tabs defaultValue="food" className="w-full" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2 p-1 bg-orange-50 m-4 rounded-full max-w-[250px] mx-auto">
          <TabsTrigger
            value="food"
            className="rounded-full data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-400 data-[state=active]:to-red-500 data-[state=active]:text-white py-2 transition-all duration-300"
          >
            <Utensils className="h-4 w-4 mr-2" />
            Food
          </TabsTrigger>
          <TabsTrigger
            value="drink"
            className="rounded-full data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-400 data-[state=active]:to-red-500 data-[state=active]:text-white py-2 transition-all duration-300"
          >
            <Coffee className="h-4 w-4 mr-2" />
            Drinks
          </TabsTrigger>
        </TabsList>

        <div ref={menuRef} className="max-h-[calc(100vh-280px)] overflow-y-auto px-4 pb-4">
          <TabsContent value="food" className="mt-0">
            <motion.div
              className="grid grid-cols-1 gap-4"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {menuItems
                .filter((item) => item.type === "food")
                .map((item) => (
                  <motion.div key={item.id} variants={itemVariants}>
                    <Card className="overflow-hidden border-none shadow-md">
                      <div className="flex">
                        <div className="w-1/3 relative h-24">
                          <Image
                            src={item.image || "/placeholder.svg"}
                            alt={item.name}
                            fill
                            className="object-cover rounded-l-lg"
                          />
                          <motion.div
                            initial={{ opacity: 0, scale: 0 }}
                            animate={addedItemId === item.id ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0 }}
                            transition={{ duration: 0.3 }}
                            className="absolute inset-0 bg-green-500/70 flex items-center justify-center rounded-l-lg"
                          >
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ type: "spring", stiffness: 400, damping: 10 }}
                            >
                              <Plus className="h-8 w-8 text-white" />
                            </motion.div>
                          </motion.div>
                        </div>
                        <CardContent className="p-3 w-2/3 flex flex-col justify-between">
                          <div>
                            <h3 className="font-medium text-gray-800">{item.name}</h3>
                            <p className="text-xs text-gray-500 line-clamp-1">{item.description}</p>
                            <p className="text-orange-500 font-bold mt-1">${item.price.toFixed(2)}</p>
                          </div>
                          <div className="flex items-center justify-end gap-2 mt-1">
                            {getItemQuantity(item.id) > 0 && (
                              <>
                                <motion.div whileTap={{ scale: 0.9 }}>
                                  <Button
                                    variant="outline"
                                    size="icon"
                                    className="h-7 w-7 rounded-full border-orange-200"
                                    onClick={() => removeFromCart(item.id)}
                                  >
                                    <Minus className="h-3 w-3 text-orange-500" />
                                  </Button>
                                </motion.div>
                                <span className="w-6 text-center font-medium">{getItemQuantity(item.id)}</span>
                              </>
                            )}
                            <motion.div whileTap={{ scale: 0.9 }}>
                              <Button
                                size="icon"
                                className="h-7 w-7 rounded-full bg-gradient-to-r from-orange-400 to-red-500 hover:from-orange-500 hover:to-red-600"
                                onClick={() => addToCart(item)}
                              >
                                <Plus className="h-3 w-3" />
                              </Button>
                            </motion.div>
                          </div>
                        </CardContent>
                      </div>
                    </Card>
                  </motion.div>
                ))}
            </motion.div>
          </TabsContent>

          <TabsContent value="drink" className="mt-0">
            <motion.div
              className="grid grid-cols-1 gap-4"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {menuItems
                .filter((item) => item.type === "drink")
                .map((item) => (
                  <motion.div key={item.id} variants={itemVariants}>
                    <Card className="overflow-hidden border-none shadow-md">
                      <div className="flex">
                        <div className="w-1/3 relative h-24">
                          <Image
                            src={item.image || "/placeholder.svg"}
                            alt={item.name}
                            fill
                            className="object-cover rounded-l-lg"
                          />
                          <motion.div
                            initial={{ opacity: 0, scale: 0 }}
                            animate={addedItemId === item.id ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0 }}
                            transition={{ duration: 0.3 }}
                            className="absolute inset-0 bg-green-500/70 flex items-center justify-center rounded-l-lg"
                          >
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ type: "spring", stiffness: 400, damping: 10 }}
                            >
                              <Plus className="h-8 w-8 text-white" />
                            </motion.div>
                          </motion.div>
                        </div>
                        <CardContent className="p-3 w-2/3 flex flex-col justify-between">
                          <div>
                            <h3 className="font-medium text-gray-800">{item.name}</h3>
                            <p className="text-xs text-gray-500 line-clamp-1">{item.description}</p>
                            <p className="text-orange-500 font-bold mt-1">${item.price.toFixed(2)}</p>
                          </div>
                          <div className="flex items-center justify-end gap-2 mt-1">
                            {getItemQuantity(item.id) > 0 && (
                              <>
                                <motion.div whileTap={{ scale: 0.9 }}>
                                  <Button
                                    variant="outline"
                                    size="icon"
                                    className="h-7 w-7 rounded-full border-orange-200"
                                    onClick={() => removeFromCart(item.id)}
                                  >
                                    <Minus className="h-3 w-3 text-orange-500" />
                                  </Button>
                                </motion.div>
                                <span className="w-6 text-center font-medium">{getItemQuantity(item.id)}</span>
                              </>
                            )}
                            <motion.div whileTap={{ scale: 0.9 }}>
                              <Button
                                size="icon"
                                className="h-7 w-7 rounded-full bg-gradient-to-r from-orange-400 to-red-500 hover:from-orange-500 hover:to-red-600"
                                onClick={() => addToCart(item)}
                              >
                                <Plus className="h-3 w-3" />
                              </Button>
                            </motion.div>
                          </div>
                        </CardContent>
                      </div>
                    </Card>
                  </motion.div>
                ))}
            </motion.div>
          </TabsContent>
        </div>
      </Tabs>

      <AnimatePresence>
        {cart.totalItems > 0 && (
          <motion.div
            className="fixed bottom-4 left-0 right-0 mx-auto w-full max-w-md px-4"
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
          >
            <Card className="rounded-2xl shadow-lg border-none overflow-hidden">
              <CardContent className="p-0">
                <div className="bg-gradient-to-r from-orange-400 to-red-500 p-4 text-white">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <ShoppingCart className="h-5 w-5" />
                      <span className="font-medium">{cart.totalItems} items</span>
                    </div>
                    <div className="font-bold text-lg">${cart.totalPrice.toFixed(2)}</div>
                  </div>
                </div>
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="p-3">
                  <Button
                    className="w-full py-6 rounded-xl bg-gradient-to-r from-green-400 to-emerald-500 hover:from-green-500 hover:to-emerald-600 text-white font-medium text-lg shadow-md"
                    onClick={onPlaceOrder}
                    disabled={cart.totalItems === 0}
                  >
                    Place Order
                  </Button>
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
