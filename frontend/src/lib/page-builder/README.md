# Next.js Page Builder Component Library

A comprehensive, type-safe component library for building pages with a drag-and-drop interface in Next.js applications.

## Overview

This component library provides 40+ pre-configured components organized into categories, each with full TypeScript support, configurable properties, event handlers, data binding, responsive behavior, and accessibility features.

## Component Statistics

- **Total Components**: 40+
- **Layout Components**: 5
- **Navigation Components**: 5
- **Form Components**: 7
- **Data Display Components**: 6
- **Next.js Specific**: 7
- **Render Modes**: Server Components (20+), Client Components (20+)

## Component Categories

### 1. Layout Components

Structural components for page organization:

- **Container**: Responsive container with max-width and padding controls
- **Grid**: CSS Grid layout with configurable columns, rows, and gaps
- **Flex**: Flexbox layout with full control over direction, alignment, and justification
- **Stack**: Simple vertical/horizontal stacking with consistent spacing
- **Section**: Semantic section element with padding and background options

### 2. Navigation Components

Components for site navigation:

- **Navbar**: Top navigation bar with logo, links, and responsive mobile menu
- **Sidebar**: Side navigation with collapsible sections and icons
- **Breadcrumbs**: Navigation breadcrumb trail showing page hierarchy
- **Tabs**: Tabbed interface for organizing content
- **Pagination**: Pagination controls for navigating pages

### 3. Form Components

Input components with validation and data binding:

- **Input**: Text input with various types (text, email, password, number, etc.)
- **Select**: Dropdown select with single and multi-select support
- **Checkbox**: Checkbox input for boolean selections
- **RadioGroup**: Radio button group for single selection
- **DatePicker**: Date and time picker with calendar interface
- **FileUpload**: File upload with drag-and-drop support
- **Textarea**: Multi-line text input field

### 4. Data Display Components

Components for displaying data:

- **Table**: Data table with sorting, filtering, pagination, and selection
- **List**: Versatile list component with various layouts
- **Card**: Card component with header, content, and footer sections
- **Badge**: Small badge or label for status and counts
- **Avatar**: User avatar with image, initials, or icon
- **Alert**: Alert message with various severity levels

### 5. Next.js-Specific Components

Components leveraging Next.js features:

- **NextImage**: Optimized image component using next/image
- **NextLink**: Client-side navigation link with prefetching
- **Loading**: Loading state component with various spinner styles
- **ErrorBoundary**: Error boundary wrapper with custom fallback UI
- **SuspenseBoundary**: Suspense boundary for streaming and lazy loading
- **ServerComponent**: Wrapper for Server Component content with data fetching
- **ClientComponent**: Wrapper for Client Component content with interactivity

## Type System

### Component Definition

Each component is defined with comprehensive metadata:

```typescript
interface ComponentDefinition {
  // Identification
  id: string;
  name: string;
  displayName: string;
  description: string;
  category: ComponentCategory;
  icon?: string;
  tags?: string[];

  // Rendering
  renderMode: 'client' | 'server' | 'hybrid';
  componentPath?: string;

  // Configuration
  props: PropertyDefinition[];
  defaultProps?: Record<string, unknown>;

  // Children
  acceptsChildren?: boolean;
  childrenTypes?: string[];

  // Events
  events?: EventDefinition[];

  // Data Bindings
  dataBindings?: DataBindingDefinition[];

  // Accessibility
  accessibility?: AccessibilityConfig;
}
```

### Property System

15+ property control types for rich configuration:

- **Basic**: text, number, boolean
- **Selection**: select, multiSelect
- **Visual**: color, image, icon
- **Layout**: alignment, spacing, typography, border, shadow, gradient
- **Advanced**: dataBinding, eventHandler, component

Each property supports:
- Default values
- Validation rules
- Data binding
- Responsive values (mobile, tablet, desktop)
- Conditional visibility
- Grouping and ordering

### Event System

Components support event handlers with actions:

```typescript
interface EventHandler {
  event: string; // 'onClick', 'onChange', etc.
  actions: EventAction[];
  preventDefault?: boolean;
  stopPropagation?: boolean;
}

type EventActionType =
  | 'navigate'
  | 'setState'
  | 'apiCall'
  | 'openModal'
  | 'showNotification'
  | 'customScript';
```

### Data Binding System

Components can bind to various data sources:

- **state**: Component state
- **props**: Component props
- **context**: React context
- **api**: API responses
- **url**: URL parameters
- **localStorage**: Browser storage
- **computed**: Computed values

## Usage

### Basic Usage

```typescript
import { ComponentCatalogRegistry } from '@/lib/page-builder/catalog/registry';
import { DefaultComponentCatalog } from '@/lib/page-builder/components';

// Get component by ID
const containerComponent = registry.getComponentById('layout-container');

// Filter components
const layoutComponents = registry.filterComponents({
  categories: ['layout']
});

// Search components
const searchResults = registry.searchComponents('button');
```

### Component Registration

```typescript
// Register custom component
registry.registerCustomComponent({
  definition: myCustomComponent,
  source: 'local',
  verified: true,
});

// Get all components (built-in + custom)
const allComponents = registry.getAllComponents();
```

### Component Validation

```typescript
// Validate component instance
const validation = registry.validateComponent('form-input', {
  name: 'email',
  type: 'email',
  label: 'Email Address',
});

if (!validation.valid) {
  console.error('Validation errors:', validation.errors);
}
```

## File Structure

```
lib/page-builder/
├── types/
│   ├── component.types.ts      # Core component types
│   ├── property.types.ts       # Property configuration types
│   ├── catalog.types.ts        # Catalog and registry types
│   └── index.ts               # Type exports
├── components/
│   ├── layout.definitions.ts   # Layout components
│   ├── navigation.definitions.ts # Navigation components
│   ├── form.definitions.ts     # Form components
│   ├── data-display.definitions.ts # Data display components
│   ├── nextjs.definitions.ts   # Next.js components
│   └── index.ts               # Component exports & registry
├── catalog/
│   └── registry.ts            # Catalog registry class
└── README.md                  # This file
```

## Component Features

### Responsive Design

All components support responsive configuration:

```typescript
// Responsive property values
{
  maxWidth: {
    mobile: 'sm',
    tablet: 'md',
    desktop: 'lg',
  }
}
```

### Accessibility

Built-in accessibility features:

- ARIA labels and attributes
- Keyboard navigation support
- Screen reader compatibility
- Focus management
- Semantic HTML

### Performance

Optimized for performance:

- Server Components for static content
- Client Components for interactivity
- Code splitting support
- Lazy loading with Suspense
- React.memo for pure components

### Styling

Flexible styling options:

- Tailwind CSS classes
- Custom CSS support
- Variants (size, color, style)
- Responsive utilities
- Dark mode support

## Extending the Library

### Adding Custom Components

1. Create component definition:

```typescript
const MyComponent: ComponentDefinition = {
  id: 'custom-my-component',
  name: 'MyComponent',
  displayName: 'My Custom Component',
  description: 'Description of my component',
  category: 'custom',
  renderMode: 'client',
  props: [
    {
      name: 'title',
      label: 'Title',
      type: 'string',
      controlType: 'text',
      defaultValue: 'Default Title',
      group: 'basic',
    },
  ],
  // ... other configuration
};
```

2. Register with catalog:

```typescript
registry.registerCustomComponent({
  definition: MyComponent,
  source: 'local',
});
```

### Creating Templates

Pre-configured component combinations:

```typescript
const HeroTemplate: ComponentTemplate = {
  id: 'template-hero',
  name: 'Hero Section',
  category: 'layout',
  components: [
    {
      id: 'hero-container',
      componentId: 'layout-container',
      props: { maxWidth: 'xl' },
      children: [
        {
          id: 'hero-content',
          componentId: 'layout-flex',
          props: { direction: 'column', alignItems: 'center' },
        },
      ],
    },
  ],
};
```

## Best Practices

### Component Design

1. **Single Responsibility**: Each component should have a clear, single purpose
2. **Composition**: Build complex UIs by composing simple components
3. **Accessibility First**: Always include ARIA labels and keyboard navigation
4. **Performance**: Use Server Components when possible, Client Components when needed
5. **Type Safety**: Leverage TypeScript for prop validation

### Property Configuration

1. **Sensible Defaults**: Provide good default values for all props
2. **Progressive Disclosure**: Group related props, hide advanced options
3. **Validation**: Add validation rules for user input
4. **Help Text**: Include descriptions and examples

### Data Binding

1. **Explicit Sources**: Clearly specify supported data sources
2. **Transform Functions**: Support data transformation
3. **Fallback Values**: Provide fallback for missing data
4. **Type Safety**: Ensure bound data matches expected types

## TypeScript Integration

All components are fully typed:

```typescript
import type {
  ComponentDefinition,
  ComponentInstance,
  PropertyDefinition,
  EventHandler,
} from '@/lib/page-builder/types';

// Type-safe component usage
const component: ComponentInstance = {
  id: 'instance-1',
  componentId: 'layout-container',
  props: {
    maxWidth: 'lg',
    padding: { all: '2rem' },
  },
  style: {
    className: 'custom-class',
  },
};
```

## Next Steps

- Implement actual React component implementations for each definition
- Create property panel UI for configuration
- Build drag-and-drop canvas
- Add component preview system
- Implement data binding runtime
- Create event handler execution engine
- Add component export/import functionality
- Build template library

## License

This component library is part of the White Cross project.
