# Components Directory Architecture

## Overview

This directory contains all reusable React components for the White Cross Healthcare Platform. Components are organized by type and feature for optimal maintainability and discoverability.

## Directory Structure

```
components/
├── README.md                    # This file - Component architecture guide
├── index.ts                     # Central component exports
├── ui/                          # Primitive/foundational UI components
│   ├── buttons/                 # Button components
│   │   ├── Button.tsx
│   │   ├── IconButton.tsx
│   │   └── LoadingButton.tsx
│   ├── inputs/                  # Input components
│   │   ├── Input.tsx
│   │   ├── Select.tsx
│   │   ├── Checkbox.tsx
│   │   ├── Radio.tsx
│   │   └── DatePicker.tsx
│   ├── feedback/                # Feedback components
│   │   ├── Alert.tsx
│   │   ├── Toast.tsx
│   │   ├── LoadingSpinner.tsx
│   │   └── ProgressBar.tsx
│   ├── layout/                  # Layout components
│   │   ├── Container.tsx
│   │   ├── Grid.tsx
│   │   ├── Stack.tsx
│   │   └── Divider.tsx
│   ├── navigation/              # Navigation components
│   │   ├── Tabs.tsx
│   │   ├── Breadcrumbs.tsx
│   │   ├── Pagination.tsx
│   │   └── Sidebar.tsx
│   ├── overlays/                # Overlay components
│   │   ├── Modal.tsx
│   │   ├── Dialog.tsx
│   │   ├── Drawer.tsx
│   │   └── Popover.tsx
│   ├── data/                    # Data display components
│   │   ├── Table.tsx
│   │   ├── DataGrid.tsx
│   │   ├── List.tsx
│   │   └── Card.tsx
│   └── display/                 # Display components
│       ├── Badge.tsx
│       ├── Avatar.tsx
│       ├── Tag.tsx
│       └── Tooltip.tsx
├── features/                    # Feature-specific components
│   ├── students/                # Student management components
│   │   ├── StudentCard.tsx
│   │   ├── StudentList.tsx
│   │   ├── StudentForm.tsx
│   │   └── StudentFilters.tsx
│   ├── medications/             # Medication management components
│   │   ├── MedicationCard.tsx
│   │   ├── MedicationForm.tsx
│   │   └── MedicationSchedule.tsx
│   ├── appointments/            # Appointment components
│   │   ├── AppointmentCard.tsx
│   │   ├── AppointmentCalendar.tsx
│   │   └── AppointmentForm.tsx
│   ├── health-records/          # Health records components
│   │   ├── HealthRecordCard.tsx
│   │   ├── HealthRecordForm.tsx
│   │   └── VitalSignsChart.tsx
│   ├── communication/           # Communication components
│   │   ├── MessageComposer.tsx
│   │   ├── MessageList.tsx
│   │   └── NotificationBell.tsx
│   ├── settings/                # Settings components
│   │   ├── SettingsPanel.tsx
│   │   └── PreferencesForm.tsx
│   └── inventory/               # Inventory components
│       ├── InventoryItem.tsx
│       └── StockAlerts.tsx
├── forms/                       # Form components
│   ├── FormField.tsx
│   ├── FormLabel.tsx
│   ├── FormError.tsx
│   └── FormSection.tsx
├── layout/                      # Application layout components
│   ├── AppLayout.tsx
│   ├── Header.tsx
│   ├── Footer.tsx
│   ├── Navigation.tsx
│   └── PageHeader.tsx
├── shared/                      # Shared/common components
│   ├── errors/                  # Error handling components
│   │   ├── ErrorBoundary.tsx
│   │   ├── ErrorMessage.tsx
│   │   └── NotFound.tsx
│   ├── security/                # Security components
│   │   ├── PermissionGate.tsx
│   │   └── SecureField.tsx
│   └── data/                    # Data handling components
│       ├── EmptyState.tsx
│       └── LoadingState.tsx
├── pages/                       # Page-specific components
│   └── admin/                   # Admin page components
│       └── UserManagement.tsx
├── providers/                   # Context providers
│   └── ThemeProvider.tsx
└── development/                 # Development utilities
    ├── examples/
    └── navigation/
```

## Component Categories

### 1. UI Components (`/ui`)
Primitive, highly reusable components with no business logic.

**Characteristics:**
- Generic and reusable across the app
- No Redux/state management
- Accept props for configuration
- Fully controlled components

**Example:**
```typescript
// ui/buttons/Button.tsx
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  onClick,
  children,
}) => {
  return (
    <button
      className={`btn btn-${variant} btn-${size}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};
```

### 2. Feature Components (`/features`)
Domain-specific components with business logic.

**Characteristics:**
- Connected to Redux store
- Feature-specific logic
- May use Redux hooks
- May call APIs

**Example:**
```typescript
// features/students/StudentList.tsx
import { useAppSelector, useAppDispatch } from '@/stores';
import { fetchStudents, selectActiveStudents } from '@/pages/students/store';

export const StudentList: React.FC = () => {
  const dispatch = useAppDispatch();
  const students = useAppSelector(selectActiveStudents);
  
  useEffect(() => {
    dispatch(fetchStudents());
  }, [dispatch]);
  
  return (
    <div>
      {students.map(student => (
        <StudentCard key={student.id} student={student} />
      ))}
    </div>
  );
};
```

### 3. Form Components (`/forms`)
Reusable form elements and form-related components.

**Example:**
```typescript
// forms/FormField.tsx
import { UseFormRegister, FieldError } from 'react-hook-form';

interface FormFieldProps {
  label: string;
  name: string;
  type?: string;
  register: UseFormRegister<any>;
  error?: FieldError;
  required?: boolean;
}

export const FormField: React.FC<FormFieldProps> = ({
  label,
  name,
  type = 'text',
  register,
  error,
  required,
}) => {
  return (
    <div className="form-field">
      <label>
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        type={type}
        {...register(name, { required })}
        className={error ? 'input-error' : 'input'}
      />
      {error && <span className="error-message">{error.message}</span>}
    </div>
  );
};
```

### 4. Layout Components (`/layout`)
Application shell and layout structure components.

**Example:**
```typescript
// layout/AppLayout.tsx
import { Header } from './Header';
import { Navigation } from './Navigation';
import { Footer } from './Footer';

export const AppLayout: React.FC<{ children: React.ReactNode }> = ({ 
  children 
}) => {
  return (
    <div className="app-layout">
      <Header />
      <div className="app-content">
        <Navigation />
        <main className="main-content">
          {children}
        </main>
      </div>
      <Footer />
    </div>
  );
};
```

### 5. Shared Components (`/shared`)
Cross-cutting concerns and utilities.

**Example:**
```typescript
// shared/errors/ErrorBoundary.tsx
import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return this.props.fallback || <div>Something went wrong.</div>;
    }

    return this.props.children;
  }
}
```

## Component Patterns

### 1. Connected Components (with Redux)

Use typed hooks for Redux integration:

```typescript
import { useAppDispatch, useAppSelector } from '@/stores';
import { fetchData, selectData, selectLoading } from '@/pages/feature/store';

export const ConnectedComponent: React.FC = () => {
  const dispatch = useAppDispatch();
  const data = useAppSelector(selectData);
  const loading = useAppSelector(selectLoading);
  
  useEffect(() => {
    dispatch(fetchData());
  }, [dispatch]);
  
  if (loading) return <LoadingSpinner />;
  
  return <div>{/* render data */}</div>;
};
```

### 2. Compound Components

For complex UI with multiple sub-components:

```typescript
// Card compound component
export const Card = ({ children }: { children: ReactNode }) => (
  <div className="card">{children}</div>
);

Card.Header = ({ children }: { children: ReactNode }) => (
  <div className="card-header">{children}</div>
);

Card.Body = ({ children }: { children: ReactNode }) => (
  <div className="card-body">{children}</div>
);

Card.Footer = ({ children }: { children: ReactNode }) => (
  <div className="card-footer">{children}</div>
);

// Usage
<Card>
  <Card.Header>Title</Card.Header>
  <Card.Body>Content</Card.Body>
  <Card.Footer>Footer</Card.Footer>
</Card>
```

### 3. Render Props Pattern

For sharing logic:

```typescript
interface DataFetcherProps<T> {
  url: string;
  children: (data: T | null, loading: boolean, error: Error | null) => ReactNode;
}

export function DataFetcher<T>({ url, children }: DataFetcherProps<T>) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  useEffect(() => {
    fetch(url)
      .then(res => res.json())
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [url]);
  
  return children(data, loading, error);
}
```

## Best Practices

### 1. Component Organization
- Keep components small and focused (Single Responsibility Principle)
- Colocate related components
- Use index files for clean imports

### 2. Props and TypeScript
- Always type props interfaces
- Use descriptive prop names
- Document complex props with JSDoc

### 3. State Management
- Use Redux for global state
- Use local state for UI-only state
- Avoid prop drilling - use Redux or Context

### 4. Performance
- Use React.memo() for expensive renders
- Use useMemo() for expensive calculations
- Use useCallback() for callbacks passed to children

### 5. Accessibility
- Use semantic HTML
- Add ARIA labels where needed
- Ensure keyboard navigation works
- Test with screen readers

### 6. Styling
- Use Tailwind CSS utility classes
- Use clsx for conditional classes
- Keep styles consistent with design system

### 7. Testing
- Write unit tests for components
- Test user interactions
- Test error states
- Test loading states

## Component Naming Conventions

- **PascalCase** for component names (e.g., `StudentCard`)
- **camelCase** for functions and variables
- **UPPER_CASE** for constants
- Descriptive names that indicate purpose

## File Naming Conventions

- Component files: `ComponentName.tsx`
- Test files: `ComponentName.test.tsx`
- Story files: `ComponentName.stories.tsx`
- Type files: `ComponentName.types.ts`
- Style files: `ComponentName.module.css` (if using CSS modules)

## Import Organization

Organize imports in this order:

```typescript
// 1. React imports
import React, { useState, useEffect } from 'react';

// 2. Third-party imports
import { useNavigate } from 'react-router-dom';
import clsx from 'clsx';

// 3. Store imports
import { useAppDispatch, useAppSelector } from '@/stores';
import { fetchData, selectData } from '@/pages/feature/store';

// 4. Component imports
import { Button } from '@/components/ui/buttons';
import { Card } from '@/components/ui/data';

// 5. Utility imports
import { formatDate } from '@/utils/date';

// 6. Type imports
import type { Student } from '@/types';

// 7. Asset imports
import logo from '@/assets/logo.png';
```

## Creating New Components

1. Determine the correct category (ui, features, forms, etc.)
2. Create the component file with proper naming
3. Define TypeScript interfaces for props
4. Implement the component with proper typing
5. Add JSDoc documentation
6. Export from index.ts if needed
7. Write tests
8. Update this README if adding a new category

## Redux Integration in Components

Always use typed hooks from the store:

```typescript
// ✅ Correct
import { useAppDispatch, useAppSelector } from '@/stores';

// ❌ Incorrect
import { useDispatch, useSelector } from 'react-redux';
```

For async actions:

```typescript
const dispatch = useAppDispatch();

// Async actions return promises
const handleSubmit = async () => {
  const result = await dispatch(createStudent(data));
  if (createStudent.fulfilled.match(result)) {
    toast.success('Student created!');
  }
};
```

## Example: Complete Feature Component

```typescript
/**
 * StudentCard - Displays student information in a card format
 * 
 * Features:
 * - Shows student basic info
 * - Displays health alerts
 * - Quick action buttons
 * - Connected to Redux store
 */
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '@/stores';
import { selectStudentById } from '@/pages/students/store';
import { Card } from '@/components/ui/data';
import { Button } from '@/components/ui/buttons';
import { Badge } from '@/components/ui/display';

interface StudentCardProps {
  studentId: string;
  onEdit?: (id: string) => void;
}

export const StudentCard: React.FC<StudentCardProps> = ({ 
  studentId, 
  onEdit 
}) => {
  const navigate = useNavigate();
  const student = useAppSelector(state => 
    selectStudentById(state, studentId)
  );
  
  if (!student) return null;
  
  const handleView = () => {
    navigate(`/students/${studentId}`);
  };
  
  const handleEdit = () => {
    onEdit?.(studentId);
  };
  
  return (
    <Card>
      <Card.Header>
        <h3>{student.firstName} {student.lastName}</h3>
        {student.hasAllergies && (
          <Badge variant="warning">Allergies</Badge>
        )}
      </Card.Header>
      <Card.Body>
        <p>Grade: {student.grade}</p>
        <p>Student #: {student.studentNumber}</p>
      </Card.Body>
      <Card.Footer>
        <Button onClick={handleView} variant="secondary">View</Button>
        <Button onClick={handleEdit} variant="primary">Edit</Button>
      </Card.Footer>
    </Card>
  );
};
```

## Support

For questions about component architecture:
1. Review this documentation
2. Check existing component implementations
3. Review React and Redux Toolkit docs
4. Contact the frontend architecture team
