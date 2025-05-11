import * as React from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'

interface RevenueOverTimeChartProps {
  data: { date: string; total: number }[]
}

export function RevenueOverTimeChart({ data }: RevenueOverTimeChartProps) {
  // Calculate statistics
  const totalRevenue = data.reduce((sum, item) => sum + item.total, 0)
  const averageRevenue = totalRevenue / data.length

  // Calculate trend (compare last two days)
  const sortedData = [...data].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
  )
  const lastDayRevenue =
    sortedData.length > 0 ? sortedData[sortedData.length - 1].total : 0
  const previousDayRevenue =
    sortedData.length > 1
      ? sortedData[sortedData.length - 2].total
      : lastDayRevenue
  const percentChange =
    previousDayRevenue !== 0
      ? ((lastDayRevenue - previousDayRevenue) / previousDayRevenue) * 100
      : 0

  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'THB',
      maximumFractionDigits: 0,
    }).format(value)
  }

  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border rounded-md p-2 shadow-sm">
          <p className="text-sm font-medium">{label}</p>
          <p className="text-sm text-primary">
            {formatCurrency(payload[0].value)}
          </p>
          <p className="text-xs text-muted-foreground">
            {payload[0].value > averageRevenue
              ? 'Above average'
              : 'Below average'}
          </p>
        </div>
      )
    }
    return null
  }

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Revenue Over Time</CardTitle>
        <CardDescription>Last 7 days revenue trend</CardDescription>
      </CardHeader>
      <CardContent className="px-2">
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Total Revenue</p>
            <p className="text-2xl font-bold">{formatCurrency(totalRevenue)}</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Daily Average</p>
            <p className="text-2xl font-bold">
              {formatCurrency(averageRevenue)}
            </p>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={data}>
            <defs>
              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="hsl(var(--primary))"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="hsl(var(--primary))"
                  stopOpacity={0}
                />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis
              dataKey="date"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11 }}
            />
            <YAxis
              tickFormatter={(value) => formatCurrency(value)}
              tick={{ fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              width={80}
            />
            <Tooltip content={<CustomTooltip />} />
            <ReferenceLine
              y={averageRevenue}
              stroke="hsl(var(--muted-foreground))"
              strokeDasharray="3 3"
            />
            <Line
              type="monotone"
              dataKey="total"
              stroke="hsl(var(--primary))"
              strokeWidth={2}
              dot={{ fill: 'hsl(var(--primary))', r: 4 }}
              activeDot={{ r: 6 }}
              fillOpacity={0.2}
              fill="url(#colorRevenue)"
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
      <CardFooter className="pt-0">
        <div className="flex items-center space-x-2 text-sm">
          <span>Trend:</span>
          {Math.abs(percentChange) < 1 ? (
            <div className="flex items-center text-muted-foreground">
              <Minus className="h-4 w-4 mr-1" />
              Stable
            </div>
          ) : percentChange > 0 ? (
            <div className="flex items-center text-emerald-500">
              <TrendingUp className="h-4 w-4 mr-1" />
              {percentChange.toFixed(1)}% increase
            </div>
          ) : (
            <div className="flex items-center text-rose-500">
              <TrendingDown className="h-4 w-4 mr-1" />
              {Math.abs(percentChange).toFixed(1)}% decrease
            </div>
          )}
        </div>
      </CardFooter>
    </Card>
  )
}
