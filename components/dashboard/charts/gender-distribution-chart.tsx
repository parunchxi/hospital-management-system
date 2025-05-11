import * as React from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from 'recharts'

interface GenderDistributionChartProps {
  data: { name: string; value: number }[]
}

// Define gender-specific colors
const COLORS = {
  Male: 'hsl(var(--chart-1))',
  Female: 'hsl(var(--chart-2))',
  Other: 'hsl(var(--chart-3))',
}

export function GenderDistributionChart({
  data,
}: GenderDistributionChartProps) {
  // Filter out zero values for better visualization
  const filteredData = data.filter((item) => item.value > 0)

  // Calculate total for percentage
  const total = data.reduce((sum, item) => sum + item.value, 0)

  // Generate stats for each gender
  const stats = data.map((item) => ({
    name: item.name,
    value: item.value,
    percentage: total > 0 ? (item.value / total) * 100 : 0,
  }))

  // Custom label formatter
  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
  }: any) => {
    if (percent < 0.05) return null

    const RADIAN = Math.PI / 180
    const radius = innerRadius + (outerRadius - innerRadius) * 0.6
    const x = cx + radius * Math.cos(-midAngle * RADIAN)
    const y = cy + radius * Math.sin(-midAngle * RADIAN)

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor="middle"
        dominantBaseline="central"
        fontSize={12}
        fontWeight="bold"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    )
  }

  // Custom tooltip - Fixed to calculate percentage on the fly
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const item = payload[0].payload
      // Calculate percentage directly to avoid undefined errors
      const itemPercentage = total > 0 ? (item.value / total) * 100 : 0

      return (
        <div className="bg-background border rounded-md p-2 shadow-sm">
          <p className="font-medium text-sm">{item.name}</p>
          <p className="text-sm">
            Count: {item.value} ({itemPercentage.toFixed(1)}%)
          </p>
        </div>
      )
    }
    return null
  }

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Gender Distribution</CardTitle>
        <CardDescription>Total users: {total}</CardDescription>
      </CardHeader>
      <CardContent className="px-2 pt-0">
        {filteredData.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex justify-center items-center">
              <ResponsiveContainer width={150} height={150}>
                <PieChart>
                  <Pie
                    data={filteredData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={70}
                    innerRadius={30}
                    labelLine={false}
                    label={renderCustomizedLabel}
                  >
                    {filteredData.map((entry) => (
                      <Cell
                        key={`cell-${entry.name}`}
                        fill={
                          COLORS[entry.name as keyof typeof COLORS] ||
                          'hsl(var(--muted))'
                        }
                      />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex flex-col justify-center">
              {stats.map((item) => (
                <div
                  key={item.name}
                  className="flex items-center justify-between mb-2"
                >
                  <div className="flex items-center">
                    <div
                      className="w-3 h-3 rounded-full mr-2"
                      style={{
                        backgroundColor:
                          COLORS[item.name as keyof typeof COLORS] ||
                          'hsl(var(--muted))',
                      }}
                    />
                    <span className="text-sm">{item.name}</span>
                  </div>
                  <div className="text-sm">
                    <span className="font-medium">{item.value}</span>
                    <span className="text-muted-foreground">
                      {' '}
                      ({item.percentage.toFixed(0)}%)
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex h-[150px] items-center justify-center text-muted-foreground">
            No gender data available
          </div>
        )}
      </CardContent>
    </Card>
  )
}
