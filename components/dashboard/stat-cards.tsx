import * as React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import * as LucideIcons from 'lucide-react'
import { LucideProps } from 'lucide-react'

// Define the type for icon names that exist in the Lucide library
type IconName = keyof typeof LucideIcons;

// Create a type for valid icon components
type IconComponent = React.ComponentType<LucideProps>;

// Define the Stat type with proper icon typing
type Stat = {
  label: string
  icon: IconName | string  // We only need the string icon name
  value: string | number
}

interface StatCardsProps {
  data: Stat[] | { stats: Stat[] } | null | undefined
}

// Helper function to get Icon component - outside of the React component
function getIconComponent(iconName: string): IconComponent {
  // Check if the icon exists in LucideIcons
  const IconComp = (LucideIcons as unknown as Record<string, IconComponent>)[iconName];
  // Return the icon or fallback to HelpCircle
  return IconComp || LucideIcons.HelpCircle;
}

export function StatCards({ data }: StatCardsProps) {
  // Handle different data formats or no data
  const statsArray = React.useMemo(() => {
    if (!data) return [];
    if (Array.isArray(data)) return data;
    if (data.stats && Array.isArray(data.stats)) return data.stats;
    return [];
  }, [data]);

  if (statsArray.length === 0) {
    return <div>No stats available.</div>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {statsArray.map((stat, i) => {
        // Get the icon name as string
        const iconName = String(stat.icon);
        
        // Get the icon component using our helper function
        const IconComponent = getIconComponent(iconName);
        
        return (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.label}
              </CardTitle>
              <IconComponent className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  )
}
