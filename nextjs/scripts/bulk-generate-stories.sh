#!/bin/bash

# Bulk generate Storybook stories for all components
# This script creates basic story templates that can be enhanced

echo "Generating Storybook stories for White Cross components..."

# Array of components with their paths
declare -A components=(
  # UI - Inputs
  ["Checkbox"]="src/components/ui/inputs/Checkbox"
  ["Radio"]="src/components/ui/inputs/Radio"
  ["Select"]="src/components/ui/inputs/Select"
  ["Switch"]="src/components/ui/inputs/Switch"
  ["Textarea"]="src/components/ui/inputs/Textarea"
  ["SearchInput"]="src/components/ui/inputs/SearchInput"

  # UI - Feedback
  ["Alert"]="src/components/ui/feedback/Alert"
  ["Progress"]="src/components/ui/feedback/Progress"
  ["LoadingSpinner"]="src/components/ui/feedback/LoadingSpinner"
  ["Toast"]="src/components/ui/feedback/Toast"
  ["AlertBanner"]="src/components/ui/feedback/AlertBanner"
  ["EmptyState"]="src/components/ui/feedback/EmptyState"

  # UI - Display
  ["Badge"]="src/components/ui/display/Badge"
  ["Avatar"]="src/components/ui/display/Avatar"
  ["StatsCard"]="src/components/ui/display/StatsCard"

  # UI - Layout
  ["Card"]="src/components/ui/layout/Card"

  # UI - Navigation
  ["Tabs"]="src/components/ui/navigation/Tabs"
  ["Breadcrumbs"]="src/components/ui/navigation/Breadcrumbs"
  ["TabNavigation"]="src/components/ui/navigation/TabNavigation"

  # UI - Charts
  ["LineChart"]="src/components/ui/charts/LineChart"
  ["BarChart"]="src/components/ui/charts/BarChart"
  ["PieChart"]="src/components/ui/charts/PieChart"
  ["DonutChart"]="src/components/ui/charts/DonutChart"
  ["AreaChart"]="src/components/ui/charts/AreaChart"

  # UI - Data
  ["Table"]="src/components/ui/data/Table"

  # Feature - Students
  ["StudentCard"]="src/components/features/students/StudentCard"
  ["StudentList"]="src/components/features/students/StudentList"
  ["StudentStatusBadge"]="src/components/features/students/StudentStatusBadge"

  # Feature - Dashboard
  ["DashboardCard"]="src/components/features/dashboard/DashboardCard"
  ["DashboardGrid"]="src/components/features/dashboard/DashboardGrid"
  ["AlertsWidget"]="src/components/features/dashboard/AlertsWidget"
  ["ChartWidget"]="src/components/features/dashboard/ChartWidget"
  ["ActivityFeedWidget"]="src/components/features/dashboard/ActivityFeedWidget"
  ["ProgressWidget"]="src/components/features/dashboard/ProgressWidget"
  ["QuickActionsWidget"]="src/components/features/dashboard/QuickActionsWidget"

  # Feature - Shared
  ["DataTable"]="src/components/features/shared/DataTable"
  ["EmptyState"]="src/components/features/shared/EmptyState"
  ["ErrorState"]="src/components/features/shared/ErrorState"
  ["FilterPanel"]="src/components/features/shared/FilterPanel"
  ["BulkActionBar"]="src/components/features/shared/BulkActionBar"
  ["ConfirmationDialog"]="src/components/features/shared/ConfirmationDialog"
  ["AttachmentList"]="src/components/features/shared/AttachmentList"
  ["StatusTimeline"]="src/components/features/shared/StatusTimeline"
  ["TagSelector"]="src/components/features/shared/TagSelector"
  ["ExportButton"]="src/components/features/shared/ExportButton"

  # Layout
  ["PageHeader"]="src/components/layout/PageHeader"
  ["PageContainer"]="src/components/layout/PageContainer"
  ["Footer"]="src/components/layout/Footer"
  ["Breadcrumbs"]="src/components/layout/Breadcrumbs"
)

# Counter for tracking progress
count=0
total=${#components[@]}

# Generate stories for each component
for component_name in "${!components[@]}"; do
  component_path="${components[$component_name]}"
  story_file="${component_path}.stories.tsx"

  # Skip if story already exists
  if [ -f "$story_file" ]; then
    echo "⏭️  Skipping $component_name (story exists)"
    continue
  fi

  # Get category from path
  category=$(echo "$component_path" | sed 's|src/components/||' | sed 's|/[^/]*$||' | sed 's|/| / |g' | sed 's/^./\U&/' | sed 's/ ./\U&/g')

  # Create story template
  cat > "$story_file" <<EOF
import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { ${component_name} } from './${component_name}';

const meta = {
  title: '${category}/${component_name}',
  component: ${component_name},
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: '${component_name} component for White Cross healthcare platform.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    // Add component-specific argTypes
  },
} satisfies Meta<typeof ${component_name}>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    // Add default props
  },
};
EOF

  ((count++))
  echo "✅ Generated story for $component_name ($count/$total)"
done

echo ""
echo "✨ Story generation complete! Generated $count stories."
echo "📝 Stories can be enhanced with specific examples and documentation."
