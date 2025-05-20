"use client"

import { useState } from "react"
import { ArrowUp, Coffee, DollarSign, ShoppingBag, Users } from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Chart, ChartContainer } from "@/components/ui/chart"
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

export default function AnalyticsPage() {
  const [period, setPeriod] = useState("weekly")

  // Sample data for charts
  const salesData = [
    { name: "Mon", sales: 1200, customers: 45, orders: 38 },
    { name: "Tue", sales: 1900, customers: 56, orders: 43 },
    { name: "Wed", sales: 1500, customers: 49, orders: 41 },
    { name: "Thu", sales: 2400, customers: 67, orders: 52 },
    { name: "Fri", sales: 2800, customers: 85, orders: 73 },
    { name: "Sat", sales: 3200, customers: 104, orders: 89 },
    { name: "Sun", sales: 2700, customers: 91, orders: 74 },
  ]

  const monthlyData = [
    { name: "Jan", sales: 12000, customers: 450, orders: 380 },
    { name: "Feb", sales: 19000, customers: 560, orders: 430 },
    { name: "Mar", sales: 15000, customers: 490, orders: 410 },
    { name: "Apr", sales: 24000, customers: 670, orders: 520 },
    { name: "May", sales: 28000, customers: 850, orders: 730 },
    { name: "Jun", sales: 32000, customers: 1040, orders: 890 },
    { name: "Jul", sales: 27000, customers: 910, orders: 740 },
    { name: "Aug", sales: 29000, customers: 930, orders: 760 },
    { name: "Sep", sales: 31000, customers: 980, orders: 820 },
    { name: "Oct", sales: 34000, customers: 1100, orders: 910 },
    { name: "Nov", sales: 33000, customers: 1050, orders: 880 },
    { name: "Dec", sales: 36000, customers: 1200, orders: 950 },
  ]

  const popularItems = [
    { name: "Espresso", orders: 245, percentage: 22 },
    { name: "Cappuccino", orders: 190, percentage: 17 },
    { name: "Latte", orders: 175, percentage: 16 },
    { name: "Mocha", orders: 125, percentage: 11 },
    { name: "Cold Brew", orders: 110, percentage: 10 },
  ]

  const chartData = period === "weekly" ? salesData : monthlyData

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Analytics Dashboard</h1>
        <p className="text-muted-foreground">Overview of your coffee shop performance and sales</p>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid grid-cols-2 h-8">
          <TabsTrigger
            value="weekly"
            onClick={() => setPeriod("weekly")}
            className={period === "weekly" ? "bg-amber-100 text-amber-800" : ""}
          >
            Weekly
          </TabsTrigger>
          <TabsTrigger
            value="monthly"
            onClick={() => setPeriod("monthly")}
            className={period === "monthly" ? "bg-amber-100 text-amber-800" : ""}
          >
            Monthly
          </TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$15,231.89</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-emerald-500 flex items-center">
                    <ArrowUp className="mr-1 h-4 w-4" />
                    +20.1%
                  </span>{" "}
                  from last month
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Orders</CardTitle>
                <ShoppingBag className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">+573</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-emerald-500 flex items-center">
                    <ArrowUp className="mr-1 h-4 w-4" />
                    +12.2%
                  </span>{" "}
                  from last month
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Customers</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">+2,350</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-emerald-500 flex items-center">
                    <ArrowUp className="mr-1 h-4 w-4" />
                    +18.7%
                  </span>{" "}
                  from last month
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Popular Item</CardTitle>
                <Coffee className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">Espresso</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-amber-500 flex items-center">245 orders</span> this month
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader className="flex flex-row items-center">
                <div className="grid gap-2">
                  <CardTitle>Sales Overview</CardTitle>
                  <CardDescription>Daily revenue for the past week</CardDescription>
                </div>
                <div className="ml-auto">
                  <TabsList className="grid grid-cols-2 h-8">
                    <TabsTrigger
                      value="weekly"
                      onClick={() => setPeriod("weekly")}
                      className={period === "weekly" ? "bg-amber-100 text-amber-800" : ""}
                    >
                      Weekly
                    </TabsTrigger>
                    <TabsTrigger
                      value="monthly"
                      onClick={() => setPeriod("monthly")}
                      className={period === "monthly" ? "bg-amber-100 text-amber-800" : ""}
                    >
                      Monthly
                    </TabsTrigger>
                  </TabsList>
                </div>
              </CardHeader>
              <CardContent className="pl-2">
                <Chart>
                  <ChartContainer className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart
                        data={chartData}
                        margin={{
                          top: 20,
                          right: 30,
                          left: 0,
                          bottom: 0,
                        }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip content={<CustomTooltip />} />
                        <Area type="monotone" dataKey="sales" stackId="1" stroke="#f59e0b" fill="#fde68a" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </Chart>
              </CardContent>
            </Card>
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Popular Items</CardTitle>
                <CardDescription>Top selling items this month</CardDescription>
              </CardHeader>
              <CardContent>
                <Chart>
                  <ChartContainer className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={popularItems}
                        layout="vertical"
                        margin={{
                          top: 25,
                          right: 25,
                          left: 20,
                          bottom: 0,
                        }}
                      >
                        <XAxis type="number" />
                        <YAxis type="category" dataKey="name" />
                        <Tooltip />
                        <Bar dataKey="orders" fill="#f59e0b" radius={[0, 4, 4, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </Chart>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="sales" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Sales Trends</CardTitle>
              <CardDescription>Compare sales, customers, and orders over time</CardDescription>
            </CardHeader>
            <CardContent className="pl-2">
              <Chart>
                <ChartContainer className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={chartData}
                      margin={{
                        top: 20,
                        right: 30,
                        left: 0,
                        bottom: 0,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="sales" stroke="#f59e0b" activeDot={{ r: 8 }} />
                      <Line type="monotone" dataKey="customers" stroke="#82ca9d" />
                      <Line type="monotone" dataKey="orders" stroke="#ffc658" />
                    </LineChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </Chart>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="orders" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Order Distribution</CardTitle>
              <CardDescription>Orders by time of day</CardDescription>
            </CardHeader>
            <CardContent className="pl-2">
              <Chart>
                <ChartContainer className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={[
                        { time: "6-9 AM", orders: 120 },
                        { time: "9-12 PM", orders: 210 },
                        { time: "12-3 PM", orders: 190 },
                        { time: "3-6 PM", orders: 140 },
                        { time: "6-9 PM", orders: 80 },
                        { time: "9-12 AM", orders: 30 },
                      ]}
                      margin={{
                        top: 20,
                        right: 30,
                        left: 0,
                        bottom: 0,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="time" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="orders" fill="#f59e0b" />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </Chart>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function CustomTooltip({ active, payload, label }: any) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border rounded-lg shadow-sm">
        <p className="font-medium">{label}</p>
        <p className="text-amber-700">${payload[0].value.toFixed(2)}</p>
      </div>
    )
  }

  return null
}
