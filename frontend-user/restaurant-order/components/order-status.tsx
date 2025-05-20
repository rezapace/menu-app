"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Check, Clock, AlertCircle, ArrowLeft, X, ShoppingBag, CreditCard } from "lucide-react"
import { motion } from "framer-motion"

type OrderStatusProps = {
  userInfo: {
    name: string
    email: string
    tableNumber: string
  }
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
  orderStatus: {
    orderId: string
    status: string
    paymentStatus: string
  }
  onBack: () => void
  onCancel: () => void
}

export default function OrderStatus({ userInfo, cart, orderStatus, onBack, onCancel }: OrderStatusProps) {
  const [status, setStatus] = useState(orderStatus.status)
  const [paymentStatus, setPaymentStatus] = useState(orderStatus.paymentStatus)
  const [progress, setProgress] = useState(0)

  // Simulate order status changes
  useEffect(() => {
    const timer1 = setTimeout(() => {
      setStatus("preparing")
      setProgress(40)
    }, 3000)

    const timer2 = setTimeout(() => {
      setPaymentStatus("paid")
      setProgress(70)
    }, 5000)

    const timer3 = setTimeout(() => {
      setStatus("ready")
      setProgress(100)
    }, 8000)

    return () => {
      clearTimeout(timer1)
      clearTimeout(timer2)
      clearTimeout(timer3)
    }
  }, [])

  const getStatusBadge = () => {
    switch (status) {
      case "pending":
        return (
          <Badge variant="outline" className="ml-2 bg-yellow-100 text-yellow-700 border-yellow-200 px-3 py-1">
            <Clock className="h-3 w-3 mr-1" /> Pending
          </Badge>
        )
      case "processing":
        return (
          <Badge variant="outline" className="ml-2 bg-blue-100 text-blue-700 border-blue-200 px-3 py-1">
            <Clock className="h-3 w-3 mr-1" /> Processing
          </Badge>
        )
      case "preparing":
        return (
          <Badge variant="outline" className="ml-2 bg-indigo-100 text-indigo-700 border-indigo-200 px-3 py-1">
            <Clock className="h-3 w-3 mr-1" /> Preparing
          </Badge>
        )
      case "ready":
        return (
          <Badge variant="outline" className="ml-2 bg-green-100 text-green-700 border-green-200 px-3 py-1">
            <Check className="h-3 w-3 mr-1" /> Ready
          </Badge>
        )
      default:
        return (
          <Badge variant="outline" className="ml-2 bg-yellow-100 text-yellow-700 border-yellow-200 px-3 py-1">
            <Clock className="h-3 w-3 mr-1" /> Pending
          </Badge>
        )
    }
  }

  const getPaymentStatusBadge = () => {
    switch (paymentStatus) {
      case "unpaid":
        return (
          <Badge variant="outline" className="ml-2 bg-red-100 text-red-700 border-red-200 px-3 py-1">
            <AlertCircle className="h-3 w-3 mr-1" /> Unpaid
          </Badge>
        )
      case "pending":
        return (
          <Badge variant="outline" className="ml-2 bg-yellow-100 text-yellow-700 border-yellow-200 px-3 py-1">
            <Clock className="h-3 w-3 mr-1" /> Pending
          </Badge>
        )
      case "paid":
        return (
          <Badge variant="outline" className="ml-2 bg-green-100 text-green-700 border-green-200 px-3 py-1">
            <Check className="h-3 w-3 mr-1" /> Paid
          </Badge>
        )
      default:
        return (
          <Badge variant="outline" className="ml-2 bg-red-100 text-red-700 border-red-200 px-3 py-1">
            <AlertCircle className="h-3 w-3 mr-1" /> Unpaid
          </Badge>
        )
    }
  }

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
    <Card className="overflow-hidden border-none shadow-lg bg-white rounded-3xl">
      <CardHeader className="bg-gradient-to-r from-orange-400 to-red-500 text-white p-4 flex flex-row items-center justify-between">
        <Button
          variant="ghost"
          size="icon"
          onClick={onBack}
          className="text-white hover:bg-white/20 rounded-full h-10 w-10"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="text-center">
          <CardTitle className="text-xl">Order Status</CardTitle>
          <CardDescription className="text-white/80">
            Order #{orderStatus.orderId} • Table {userInfo.tableNumber}
          </CardDescription>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={onCancel}
          className="text-white hover:bg-white/20 rounded-full h-10 w-10"
        >
          <X className="h-5 w-5" />
        </Button>
      </CardHeader>
      <CardContent className="p-6">
        <motion.div className="space-y-6" variants={containerVariants} initial="hidden" animate="visible">
          <motion.div variants={itemVariants} className="space-y-4">
            <div className="w-full bg-gray-100 rounded-full h-2.5">
              <motion.div
                className="bg-gradient-to-r from-orange-400 to-red-500 h-2.5 rounded-full"
                initial={{ width: "10%" }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5 }}
              ></motion.div>
            </div>

            <div className="bg-orange-50 rounded-2xl p-4 space-y-3">
              <div className="flex items-center">
                <ShoppingBag className="h-5 w-5 text-orange-500 mr-2" />
                <span className="text-gray-700 font-medium">Order Status:</span>
                {getStatusBadge()}
              </div>
              <div className="flex items-center">
                <CreditCard className="h-5 w-5 text-orange-500 mr-2" />
                <span className="text-gray-700 font-medium">Payment Status:</span>
                {getPaymentStatusBadge()}
              </div>
            </div>
          </motion.div>

          <motion.div variants={itemVariants}>
            <h3 className="font-medium mb-3 text-gray-800 flex items-center">
              <ShoppingBag className="h-5 w-5 text-orange-500 mr-2" />
              Order Summary
            </h3>
            <Card className="border-orange-100 shadow-sm">
              <CardContent className="p-4 space-y-2">
                {cart.items.map((item) => (
                  <motion.div
                    key={item.id}
                    className="flex justify-between items-center"
                    whileHover={{ scale: 1.01 }}
                    transition={{ duration: 0.2 }}
                  >
                    <span className="text-gray-700">
                      <span className="font-medium text-orange-500">{item.quantity}x</span> {item.name}
                    </span>
                    <span className="font-medium">${(item.price * item.quantity).toFixed(2)}</span>
                  </motion.div>
                ))}
                <div className="border-t border-orange-100 pt-2 mt-2 font-bold flex justify-between text-gray-800">
                  <span>Total</span>
                  <span className="text-orange-500">${cart.totalPrice.toFixed(2)}</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants} className="pt-4">
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                className="w-full py-6 rounded-xl bg-gradient-to-r from-orange-400 to-red-500 hover:from-orange-500 hover:to-red-600 text-white font-medium text-lg shadow-md"
                onClick={onCancel}
              >
                Back to Home
              </Button>
            </motion.div>
          </motion.div>
        </motion.div>
      </CardContent>
    </Card>
  )
}
