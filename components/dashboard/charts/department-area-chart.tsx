import * as React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  AreaChart as ReAreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts'
import { Badge } from "@/components/ui/badge"

interface DepartmentAreaChartProps {
  title: string
  data: any[]
  config: Record<string, { label: string; color: string }>
}

export function DepartmentAreaChart({ title, data, config }: DepartmentAreaChartProps) {
  const [visibleDepts, setVisibleDepts] = React.useState<string[]>(Object.keys(config));
  
  // Toggle department visibility
  const toggleDepartment = (dept: string) => {
    if (visibleDepts.includes(dept)) {
      if (visibleDepts.length > 1) { // Don't remove if it's the only one visible
        setVisibleDepts(visibleDepts.filter(d => d !== dept));
      }
    } else {
      setVisibleDepts([...visibleDepts, dept]);
    }
  };

  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border rounded-md p-2 shadow-sm">
          <p className="text-sm font-medium">{label}</p>
          <div className="mt-1 space-y-1">
            {payload
              .filter((p: any) => visibleDepts.includes(p.dataKey))
              .map((entry: any, index: number) => (
                <div key={`item-${index}`} className="flex items-center justify-between gap-2">
                  <div className="flex items-center">
                    <div 
                      className="w-3 h-3 rounded-full mr-2" 
                      style={{ backgroundColor: entry.color }}
                    />
                    <span className="text-sm font-medium">{entry.name}</span>
                  </div>
                  <span className="text-sm">{entry.value}</span>
                </div>
              ))}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>Last 7 days by department</CardDescription>
        <div className="flex flex-wrap gap-1.5 mt-2">
          {Object.entries(config).map(([key, { label, color }]) => (
            <Badge
              key={key}
              variant={visibleDepts.includes(key) ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => toggleDepartment(key)}
              style={{
                backgroundColor: visibleDepts.includes(key) ? color : 'transparent',
                borderColor: color,
                color: visibleDepts.includes(key) ? 'white' : undefined
              }}
            >
              {label}
            </Badge>
          ))}
        </div>
      </CardHeader>
      <CardContent className="px-2 pt-0">
        <ResponsiveContainer width="100%" height={250}>
          <ReAreaChart data={data}>
            <defs>
              {Object.entries(config).map(([key, { color }]) => (
                <linearGradient key={key} id={`color-${key}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={color} stopOpacity={0.8}/>
                  <stop offset="95%" stopColor={color} stopOpacity={0.1}/>
                </linearGradient>
              ))}
            </defs>
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tick={{ fontSize: 12 }}
            />
            <YAxis 
              tick={{ fontSize: 12 }}
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <Tooltip content={<CustomTooltip />} />
            {Object.entries(config).map(([key, { color }]) => (
              visibleDepts.includes(key) && (
                <Area
                  key={key}
                  type="monotone"
                  dataKey={key}
                  stroke={color}
                  fill={`url(#color-${key})`}
                  strokeWidth={2}
                />
              )
            ))}
          </ReAreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
