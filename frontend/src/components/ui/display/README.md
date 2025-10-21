# UI Components - Display

Components for displaying data, statistics, and content in various formats.

## Components

### StatsCard
Displays key metrics and statistics with optional trends.

```tsx
import { StatsCard } from '@/components/ui/display'

<StatsCard
  title="Total Students"
  value={245}
  description="Enrolled this year"
  icon={<UsersIcon />}
  trend={{
    value: 12,
    isPositive: true,
    label: "vs last month"
  }}
/>
```

**Props:**
- `title`: Card title
- `value`: Main statistic value
- `description?`: Optional description
- `icon`: Icon element
- `iconColor?`: Icon color class
- `trend?`: Optional trend information
- `onClick?`: Click handler for interactive cards
- `className?`: Additional CSS classes
- `testId?`: Test identifier

## Features

- **Interactive**: Supports click handlers for navigation
- **Accessible**: Proper ARIA roles and keyboard support  
- **Trend Indicators**: Shows positive/negative trends with colors
- **Responsive**: Adapts to different screen sizes
- **Customizable**: Flexible styling and content options

## Usage Guidelines

- Use for dashboard metrics and key performance indicators
- Keep titles concise and descriptive
- Use consistent iconography across related cards
- Provide trend data when available for better insights