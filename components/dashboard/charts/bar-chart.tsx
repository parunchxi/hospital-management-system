import * as React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  BarChart as ReBarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

interface ChartDataProps {
  title: string
  data: any[]
  dataKey: string
  categoryKey: string
  color?: string
}

export function BarChartCard({
  title,
  data,
  dataKey,
  categoryKey,
  color = 'hsl(var(--chart-2))',
}: ChartDataProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="px-2 pt-4">
        <ResponsiveContainer width="100%" height={250}>
          <ReBarChart data={data}>
            <XAxis dataKey={categoryKey} />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Bar dataKey={dataKey} fill={color} />
          </ReBarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
