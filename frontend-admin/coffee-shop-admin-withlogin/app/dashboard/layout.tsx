"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { BarChart3, Coffee, LogOut, MenuIcon, ShoppingBag, User } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent } from "@/components/ui/sheet"
import { useToast } from "@/components/ui/use-toast"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const { toast } = useToast()

  // Check if user is authenticated
  useEffect(() => {
    const token = localStorage.getItem("authToken") || sessionStorage.getItem("authToken")
    if (!token) {
      router.push("/login")
    }
  }, [router])

  const routes = [
    {
      href: "/dashboard",
      label: "Analytics",
      icon: <BarChart3 className="h-5 w-5" />,
      active: pathname === "/dashboard",
    },
    {
      href: "/dashboard/menu",
      label: "Menu",
      icon: <Coffee className="h-5 w-5" />,
      active: pathname === "/dashboard/menu",
    },
    {
      href: "/dashboard/orders",
      label: "Orders",
      icon: <ShoppingBag className="h-5 w-5" />,
      active: pathname === "/dashboard/orders",
    },
  ]

  const handleLogout = () => {
    // Clear auth tokens
    localStorage.removeItem("authToken")
    sessionStorage.removeItem("authToken")

    // Show toast
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    })

    // Redirect to login
    router.push("/login")
  }

  return (
    <div className="h-screen">
      {/* Mobile Sidebar */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="left" className="p-0">
          <div className="flex flex-col h-full bg-gradient-to-b from-amber-50 to-slate-50 text-slate-800">
            <div className="px-6 py-5 border-b border-slate-200">
              <Link href="/dashboard" className="flex items-center gap-2">
                <Coffee className="h-6 w-6 text-amber-500" />
                <span className="font-semibold text-xl text-slate-800">Brew Haven</span>
              </Link>
            </div>
            <div className="flex-1 px-3 py-4">
              <nav className="flex flex-col gap-1">
                {routes.map((route) => (
                  <Link
                    key={route.href}
                    href={route.href}
                    onClick={() => setOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors duration-200 ${
                      route.active
                        ? "bg-amber-100 text-amber-800 font-medium"
                        : "text-slate-600 hover:bg-slate-200/80 hover:text-slate-900"
                    }`}
                  >
                    {route.icon}
                    {route.label}
                  </Link>
                ))}
              </nav>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Main Content */}
      <div className="h-screen md:flex">
        {/* Desktop Sidebar */}
        <div className="hidden md:flex flex-col h-screen w-64 bg-gradient-to-b from-amber-50 to-slate-50 text-slate-800 shadow-sm">
          <div className="px-6 py-5 border-b border-slate-200">
            <Link href="/dashboard" className="flex items-center gap-2">
              <Coffee className="h-6 w-6 text-amber-500" />
              <span className="font-semibold text-xl text-slate-800">Brew Haven</span>
            </Link>
          </div>
          <div className="flex-1 px-3 py-4">
            <nav className="flex flex-col gap-1">
              {routes.map((route) => (
                <Link
                  key={route.href}
                  href={route.href}
                  className={`flex items-center gap-3 px-3 py-3 rounded-md text-sm transition-colors duration-200 ${
                    route.active
                      ? "bg-amber-100 text-amber-800 font-medium"
                      : "text-slate-600 hover:bg-slate-200/80 hover:text-slate-900"
                  }`}
                >
                  {route.icon}
                  {route.label}
                </Link>
              ))}
            </nav>
          </div>
          <div className="p-4 border-t border-slate-200">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="w-full justify-start text-slate-600 hover:text-slate-900 hover:bg-amber-100/80"
                >
                  <User className="mr-2 h-4 w-4" />
                  <span>Alex Johnson</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/dashboard/profile">
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 h-screen overflow-auto bg-gray-50">
          {/* Top Bar */}
          <header className="h-16 border-b bg-white shadow-sm flex items-center px-4 md:px-6 sticky top-0 z-10">
            <Button variant="ghost" size="icon" onClick={() => setOpen(true)} className="md:hidden">
              <MenuIcon className="h-6 w-6" />
            </Button>
            <div className="md:hidden flex-1 flex justify-center">
              <Link href="/dashboard" className="flex items-center gap-2">
                <Coffee className="h-5 w-5 text-amber-500" />
                <span className="font-semibold text-lg">Brew Haven</span>
              </Link>
            </div>
            <div className="ml-auto flex items-center gap-4">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <User className="h-5 w-5" />
                    <span className="sr-only">User menu</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard/profile">
                      <User className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Logout</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </header>

          {/* Page Content */}
          <main className="p-4 md:p-6 space-y-6">{children}</main>
        </div>
      </div>
    </div>
  )
}
