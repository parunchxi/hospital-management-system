import * as React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { ScrollArea } from "@/components/ui/scroll-area"

interface MedicineQuantityChartProps {
  data: { name: string; quantity: number }[]
}

export function MedicineQuantityChart({ data }: MedicineQuantityChartProps) {
  // Sort by quantity in descending order
  const sortedData = React.useMemo(() => {
    return [...data].sort((a, b) => b.quantity - a.quantity).slice(0, 8);
  }, [data]);
  
  // Calculate total quantity
  const totalDispensed = data.reduce((sum, item) => sum + item.quantity, 0);

  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const percentage = ((payload[0].value / totalDispensed) * 100).toFixed(1);
      return (
        <div className="bg-background border rounded-md p-2 shadow-sm">
          <p className="text-sm font-medium">{label}</p>
          <p className="text-sm">Quantity: {payload[0].value}</p>
          <p className="text-sm text-muted-foreground">
            {percentage}% of total
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Top Medicines Dispensed</CardTitle>
        <CardDescription>
          {sortedData.length > 0 ? 
            `${totalDispensed} units dispensed total` : 
            'No medication data available'}
        </CardDescription>
      </CardHeader>
      <CardContent className="px-2 pt-0">
        {sortedData.length > 0 ? (
          <ScrollArea className="h-[250px]">
            <ResponsiveContainer width="100%" height={Math.max(250, sortedData.length * 40)}>
              <BarChart
                data={sortedData}
                layout="vertical"
                margin={{ top: 5, right: 30, left: 80, bottom: 5 }}
              >
                <CartesianGrid horizontal strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis 
                  dataKey="name" 
                  type="category" 
                  tick={{ fontSize: 12 }}
                  width={80}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="quantity" barSize={20} radius={[0, 4, 4, 0]}>
                  {sortedData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={`hsl(var(--chart-${(index % 5) + 1}))`} 
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ScrollArea>
        ) : (
          <div className="flex h-[250px] items-center justify-center text-muted-foreground">
            No medicine data available
          </div>
        )}
      </CardContent>
    </Card>
  )
}
