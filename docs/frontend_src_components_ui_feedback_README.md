# UI Components - Feedback

Components for user feedback including loading states, alerts, notifications, and progress indicators.

## Components

### LoadingSpinner
A reusable loading spinner component with customizable size and color.

```tsx
import { LoadingSpinner } from '@/components/ui/feedback'

// Basic usage
<LoadingSpinner />

// With custom size
<LoadingSpinner size="large" />
```

### AlertBanner
Displays important messages and alerts to users.

```tsx
import { AlertBanner } from '@/components/ui/feedback'

<AlertBanner 
  type="error" 
  message="Failed to save changes" 
  onDismiss={() => {}} 
/>
```

### UpdateToast
Toast notifications for displaying temporary messages.

```tsx
import { showSuccessToast, showErrorToast } from '@/components/ui/feedback'

// Success notification
showSuccessToast('Data saved successfully!')

// Error notification  
showErrorToast('Failed to save data')
```

### EmptyState
Displays when there's no data to show.

```tsx
import { EmptyState } from '@/components/ui/feedback'

<EmptyState 
  title="No students found"
  description="Try adjusting your filters"
  icon={<UsersIcon />}
/>
```

### OptimisticUpdateIndicator
Shows when optimistic updates are in progress.

```tsx
import { OptimisticUpdateIndicator } from '@/components/ui/feedback'

<OptimisticUpdateIndicator isVisible={isUpdating} />
```

## Design Principles

- **Consistent**: All feedback components follow the same design language
- **Accessible**: Proper ARIA labels and keyboard support
- **Responsive**: Work on all screen sizes
- **Customizable**: Support theming and custom styling