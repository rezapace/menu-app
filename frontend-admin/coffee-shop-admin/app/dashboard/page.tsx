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
import { useAnalyticsSummary } from "@/lib/api-hooks"
import { Skeleton } from "@/components/ui/skeleton"

export default function AnalyticsPage() {
  const [period, setPeriod] = useState("weekly")
  const { data: analytics, isLoading, error } = useAnalyticsSummary()

  // Use the data from the API or fallback to empty arrays if loading
  const salesData = period === "weekly" ? analytics?.salesData?.weekly || [] : analytics?.salesData?.monthly || []

  const popularItems = analytics?.popularItems || []
  const orderDistribution = analytics?.orderDistribution || []
  const summary = analytics?.summary || {
    totalRevenue: 0,
    totalOrders: 0,
    totalCustomers: 0,
    popularItem: "",
    popularItemOrders: 0,
    revenueGrowth: 0,
    ordersGrowth: 0,
    customersGrowth: 0,
  }

  if (error) {
    console.error("Error loading analytics:", error)
  }

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
                {isLoading ? (
                  <Skeleton className="h-8 w-32" />
                ) : (
                  <>
                    <div className="text-2xl font-bold">
                      $
                      {summary.totalRevenue.toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      <span className="text-emerald-500 flex items-center">
                        <ArrowUp className="mr-1 h-4 w-4" />+{summary.revenueGrowth}%
                      </span>{" "}
                      from last month
                    </p>
                  </>
                )}
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Orders</CardTitle>
                <ShoppingBag className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <Skeleton className="h-8 w-32" />
                ) : (
                  <>
                    <div className="text-2xl font-bold">+{summary.totalOrders}</div>
                    <p className="text-xs text-muted-foreground">
                      <span className="text-emerald-500 flex items-center">
                        <ArrowUp className="mr-1 h-4 w-4" />+{summary.ordersGrowth}%
                      </span>{" "}
                      from last month
                    </p>
                  </>
                )}
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Customers</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <Skeleton className="h-8 w-32" />
                ) : (
                  <>
                    <div className="text-2xl font-bold">+{summary.totalCustomers}</div>
                    <p className="text-xs text-muted-foreground">
                      <span className="text-emerald-500 flex items-center">
                        <ArrowUp className="mr-1 h-4 w-4" />+{summary.customersGrowth}%
                      </span>{" "}
                      from last month
                    </p>
                  </>
                )}
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Popular Item</CardTitle>
                <Coffee className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <Skeleton className="h-8 w-32" />
                ) : (
                  <>
                    <div className="text-2xl font-bold">{summary.popularItem}</div>
                    <p className="text-xs text-muted-foreground">
                      <span className="text-amber-500 flex items-center">{summary.popularItemOrders} orders</span> this
                      month
                    </p>
                  </>
                )}
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
                {isLoading ? (
                  <div className="h-[300px] w-full flex items-center justify-center">
                    <Skeleton className="h-[250px] w-[90%]" />
                  </div>
                ) : (
                  <Chart>
                    <ChartContainer className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart
                          data={salesData}
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
                )}
              </CardContent>
            </Card>
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Popular Items</CardTitle>
                <CardDescription>Top selling items this month</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="h-[300px] w-full flex items-center justify-center">
                    <Skeleton className="h-[250px] w-[90%]" />
                  </div>
                ) : (
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
                )}
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
              {isLoading ? (
                <div className="h-[400px] w-full flex items-center justify-center">
                  <Skeleton className="h-[350px] w-[95%]" />
                </div>
              ) : (
                <Chart>
                  <ChartContainer className="h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={salesData}
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
              )}
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
              {isLoading ? (
                <div className="h-[400px] w-full flex items-center justify-center">
                  <Skeleton className="h-[350px] w-[95%]" />
                </div>
              ) : (
                <Chart>
                  <ChartContainer className="h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={orderDistribution}
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
              )}
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
