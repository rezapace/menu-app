"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import UserInfoForm from "@/components/user-info-form"
import MenuPage from "@/components/menu-page"
import OrderStatus from "@/components/order-status"
import { AnimatePresence, motion } from "framer-motion"

export default function Home() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [userInfo, setUserInfo] = useState({
    name: "",
    email: "",
    tableNumber: "",
  })
  const [cart, setCart] = useState<{
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
  }>({
    items: [],
    totalItems: 0,
    totalPrice: 0,
  })
  const [orderStatus, setOrderStatus] = useState({
    orderId: "",
    status: "pending",
    paymentStatus: "unpaid",
  })

  const handleUserInfoSubmit = (data: typeof userInfo) => {
    setUserInfo(data)
    setStep(2)
  }

  const handlePlaceOrder = () => {
    // In a real app, you would send the order to a server here
    const orderId = `ORD-${Math.floor(Math.random() * 10000)}`
    setOrderStatus({
      orderId,
      status: "processing",
      paymentStatus: "pending",
    })
    setStep(3)
  }

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1)
    }
  }

  const handleCancel = () => {
    // Reset all state and go back to step 1
    setUserInfo({
      name: "",
      email: "",
      tableNumber: "",
    })
    setCart({
      items: [],
      totalItems: 0,
      totalPrice: 0,
    })
    setOrderStatus({
      orderId: "",
      status: "pending",
      paymentStatus: "unpaid",
    })
    setStep(1)
  }

  // Page transitions
  const pageVariants = {
    initial: {
      opacity: 0,
      x: 100,
    },
    animate: {
      opacity: 1,
      x: 0,
      transition: {
        type: "spring",
        stiffness: 260,
        damping: 20,
      },
    },
    exit: {
      opacity: 0,
      x: -100,
      transition: {
        duration: 0.3,
      },
    },
  }

  return (
    <main className="bg-gradient-to-b from-amber-50 to-orange-50 min-h-screen flex flex-col items-center justify-center py-8 px-4">
      <div className="w-full max-w-md mx-auto">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial="initial"
              animate="animate"
              exit="exit"
              variants={pageVariants}
              className="w-full"
            >
              <UserInfoForm onSubmit={handleUserInfoSubmit} onCancel={handleCancel} />
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial="initial"
              animate="animate"
              exit="exit"
              variants={pageVariants}
              className="w-full"
            >
              <MenuPage
                cart={cart}
                setCart={setCart}
                onPlaceOrder={handlePlaceOrder}
                onBack={handleBack}
                onCancel={handleCancel}
              />
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              initial="initial"
              animate="animate"
              exit="exit"
              variants={pageVariants}
              className="w-full"
            >
              <OrderStatus
                userInfo={userInfo}
                cart={cart}
                orderStatus={orderStatus}
                onBack={handleBack}
                onCancel={handleCancel}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  )
}
