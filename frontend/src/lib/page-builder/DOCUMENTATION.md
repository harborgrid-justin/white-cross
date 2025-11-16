# Page Builder Component Library - Complete Documentation

## Table of Contents

1. [Overview](#overview)
2. [Architecture](#architecture)
3. [Getting Started](#getting-started)
4. [Component Adapters](#component-adapters)
5. [Type System](#type-system)
6. [Variant System](#variant-system)
7. [Composition Patterns](#composition-patterns)
8. [Component Palette](#component-palette)
9. [Component Registry](#component-registry)
10. [Available Components](#available-components)
11. [Best Practices](#best-practices)
12. [Performance](#performance)
13. [Accessibility](#accessibility)
14. [Extension Guide](#extension-guide)

## Overview

The Page Builder Component Library is a comprehensive, type-safe system for integrating reusable UI components into a visual page builder. It bridges the gap between your existing UI component library and the page builder's component model.

### Key Features

- **Adapter Pattern**: Wrap existing components without modification
- **Full TypeScript Support**: Generic types ensure type safety
- **Variant System**: Configure component variants (size, color, style)
- **Composition Patterns**: HOCs, compound components, slots
- **Visual Palette**: Browse and select components
- **Centralized Registry**: Manage all available components
- **Performance Optimized**: Lazy loading, memoization, code splitting
- **Accessibility**: Preserves all a11y features

## Architecture

### Component Layers

```
┌─────────────────────────────────────┐
│      Page Builder Layer             │
│  (ComponentInstance, Events, etc.)  │
└─────────────┬───────────────────────┘
              │
┌─────────────▼───────────────────────┐
│        Adapter Layer                │
│  (Transform props, events, styles)  │
└─────────────┬───────────────────────┘
              │
┌─────────────▼───────────────────────┐
│         UI Component Layer          │
│    (Button, Card, Table, etc.)      │
└─────────────────────────────────────┘
```

### Data Flow

```
Builder Props → Adapter (Transform) → UI Component Props → Rendered Component
```

## Getting Started

### Installation

The library is already integrated into the page builder. Import components and utilities:

```typescript
import {
  ButtonAdapter,
  CardAdapter,
  ComponentPalette,
  globalRegistry,
} from '@/lib/page-builder';
```

### Basic Usage

```typescript
import { ButtonAdapter, ButtonDefinition } from '@/lib/page-builder';

// Create a component instance
const buttonInstance: ComponentInstance = {
  id: 'button-1',
  componentId: 'ui-button',
  props: {
    variant: 'default',
    size: 'lg',
  },
  style: {},
  events: [],
};

// Render the component
<ButtonAdapter.Component
  instance={buttonInstance}
  context={builderContext}
  props={buttonInstance.props}
>
  Click Me
</ButtonAdapter.Component>
```

## Component Adapters

### What are Adapters?

Adapters wrap UI components to make them compatible with the page builder. They:

- Transform builder props to component props
- Handle events and actions
- Apply styles and accessibility attributes
- Manage conditional rendering

### Creating an Adapter

```typescript
import { createAdapter } from '@/lib/page-builder/utils/createAdapter';
import { Button, ButtonProps } from '@/components/ui/button';

const ButtonAdapter = createAdapter<ButtonProps, any>(
  Button,                 // The UI component
  ButtonDefinition,       // Component metadata
  {
    transformProps: (props, context) => ({
      variant: props.variant,
      size: props.size,
      disabled: props.disabled,
    }),
    defaults: {
      variant: 'default',
      size: 'default',
    },
  }
);
```

### Adapter Configuration

```typescript
interface AdapterConfig<UIProps, BuilderProps> {
  transformProps: (props: BuilderProps, context: BuilderContext) => UIProps;
  transformEvents?: (events: EventHandler[], context: BuilderContext) => Partial<UIProps>;
  validateProps?: (props: BuilderProps) => PropValidationResult;
  defaults?: Partial<BuilderProps>;
}
```

## Type System

### Core Types

#### PageBuilderAdapter

```typescript
interface PageBuilderAdapter<UIProps, BuilderProps> {
  definition: ComponentDefinition;
  config: AdapterConfig<UIProps, BuilderProps>;
  UIComponent: ComponentType<UIProps>;
  Component: ComponentType<PageBuilderAdapterProps<BuilderProps>>;
}
```

#### ComponentDefinition

```typescript
interface ComponentDefinition {
  id: string;
  name: string;
  displayName: string;
  description: string;
  category: ComponentCategory;
  props: PropertyDefinition[];
  acceptsChildren?: boolean;
  events?: EventDefinition[];
  // ...
}
```

#### ComponentInstance

```typescript
interface ComponentInstance {
  id: string;
  componentId: string;
  props: Record<string, unknown>;
  style: StyleConfig;
  children?: ComponentInstance[];
  events?: EventHandler[];
  // ...
}
```

### Type Safety

```typescript
// Type-safe adapter
const adapter: PageBuilderAdapter<ButtonProps, ButtonBuilderProps> = createAdapter(
  Button,
  ButtonDefinition,
  config
);

// Extract types from adapter
type UIProps = UIComponentProps<typeof adapter>;
type BuilderProps = BuilderComponentProps<typeof adapter>;
```

## Variant System

### Variant Configuration

```typescript
interface VariantConfig {
  name: string;
  label: string;
  values: VariantValue[];
  defaultValue?: string;
  multiSelect?: boolean;
}

interface VariantValue {
  value: string;
  label: string;
  icon?: string;
  description?: string;
  isDefault?: boolean;
}
```

### Using VariantPicker

```typescript
import { VariantPicker } from '@/lib/page-builder/palette/VariantPicker';

<VariantPicker
  variant={{
    name: 'variant',
    label: 'Button Style',
    values: [
      { value: 'default', label: 'Default', isDefault: true },
      { value: 'outline', label: 'Outline' },
      { value: 'ghost', label: 'Ghost' },
    ],
  }}
  value="default"
  onChange={(value) => updateProps({ variant: value })}
  mode="grid"  // or "radio" or "select"
/>
```

### Multi-Variant Picker

```typescript
<MultiVariantPicker
  variants={[
    { name: 'variant', label: 'Style', values: [...] },
    { name: 'size', label: 'Size', values: [...] },
  ]}
  values={{ variant: 'default', size: 'md' }}
  onChange={(values) => updateProps(values)}
/>
```

## Composition Patterns

### Higher-Order Components

#### withPageBuilder

```typescript
const EnhancedComponent = withPageBuilder(MyComponent, definition);
```

#### withVariants

```typescript
const VariantButton = withVariants(Button, {
  primary: { variant: 'default', size: 'lg' },
  secondary: { variant: 'outline', size: 'sm' },
});
```

#### withConditionalRender

```typescript
const ConditionalButton = withConditionalRender(
  Button,
  (props, context) => context.pageState.showButton
);
```

### Compound Components

```typescript
const CardCompound = createCompoundComponent({
  Root: {
    component: Card,
    definition: CardDefinition,
  },
  components: {
    Header: { component: CardHeader, definition: CardHeaderDefinition },
    Title: { component: CardTitle, definition: CardTitleDefinition },
    Content: { component: CardContent, definition: CardContentDefinition },
  },
});

// Usage
<CardCompound.Root.Component {...}>
  <CardCompound.Header.Component {...}>
    <CardCompound.Title.Component {...}>
      Title
    </CardCompound.Title.Component>
  </CardCompound.Header.Component>
</CardCompound.Root.Component>
```

### Slot-Based Composition

```typescript
<Slot
  name="header"
  config={{
    required: true,
    maxComponents: 1,
  }}
  fallback={<DefaultHeader />}
>
  {children}
</Slot>
```

### Composing HOCs

```typescript
const EnhancedComponent = composeHOCs(
  withPageBuilder,
  withVariants,
  withErrorBoundary
)(MyComponent);
```

## Component Palette

### ComponentPalette

Visual UI for browsing and selecting components.

```typescript
import { ComponentPalette } from '@/lib/page-builder/palette/ComponentPalette';

<ComponentPalette
  components={allComponents}
  selectedCategory="form"
  viewMode="grid"
  showPreviews={true}
  onComponentSelect={(component) => {
    addComponentToCanvas(component);
  }}
  onComponentDragStart={(component, e) => {
    e.dataTransfer.effectAllowed = 'copy';
  }}
/>
```

### Features

- **Search**: Full-text search across name, description, tags
- **Filter by Category**: Layout, Form, Data Display, etc.
- **View Modes**: Grid or List view
- **Drag and Drop**: Drag components to canvas
- **Component Previews**: Show thumbnail previews

## Component Registry

### Using the Global Registry

```typescript
import { globalRegistry } from '@/lib/page-builder';

// Get all components
const allComponents = globalRegistry.getAllComponents();

// Get component by ID
const button = globalRegistry.getComponentById('ui-button');

// Search components
const results = globalRegistry.searchComponents('button');

// Filter components
const formComponents = globalRegistry.filterComponents({
  categories: ['form'],
  tags: ['interactive'],
});

// Get suggestions
const suggestions = globalRegistry.getSuggestions({
  parentComponent: 'ui-card',
  recentlyUsed: ['ui-button', 'ui-badge'],
});
```

### Registering Custom Components

```typescript
globalRegistry.registerCustomComponent({
  definition: CustomComponentDefinition,
  source: 'local',
  author: 'Your Name',
  verified: true,
});
```

### Validating Components

```typescript
const validation = globalRegistry.validateComponent('ui-button', {
  variant: 'default',
  size: 'lg',
});

if (!validation.valid) {
  console.error('Validation errors:', validation.errors);
}
```

## Available Components

### Button

**ID**: `ui-button`
**Category**: Form
**Description**: Interactive button component

**Variants**:
- `variant`: default, destructive, outline, secondary, ghost, link
- `size`: sm, default, lg, icon, icon-sm, icon-lg

**Props**:
- `variant` (string)
- `size` (string)
- `disabled` (boolean)
- `loading` (boolean)
- `type` (string): button, submit, reset

**Events**: onClick, onDoubleClick, onMouseEnter, onMouseLeave

### Badge

**ID**: `ui-badge`
**Category**: Data Display
**Description**: Small status indicator

**Variants**:
- `variant`: default, secondary, destructive, outline, success, warning, error, info

### Card (Compound Component)

**ID**: `ui-card`
**Category**: Data Display
**Description**: Container with header, content, and footer

**Sub-components**:
- `ui-card-header`: Card Header
- `ui-card-title`: Card Title
- `ui-card-description`: Card Description
- `ui-card-content`: Card Content
- `ui-card-footer`: Card Footer

### Alert (Compound Component)

**ID**: `ui-alert`
**Category**: Data Display
**Description**: Display important messages

**Variants**:
- `variant`: default, destructive

**Sub-components**:
- `ui-alert-title`: Alert Title
- `ui-alert-description`: Alert Description

### Separator

**ID**: `ui-separator`
**Category**: Layout
**Description**: Visual divider

**Props**:
- `orientation` (string): horizontal, vertical
- `decorative` (boolean)

## Best Practices

### Component Design

1. **Keep adapters simple**: Only transform what's necessary
2. **Preserve component features**: Don't lose functionality in adapter
3. **Use compound components**: For related components (Card, Alert)
4. **Define clear variants**: Make variant names descriptive

### Type Safety

1. **Always specify generic types**:
   ```typescript
   const adapter = createAdapter<UIProps, BuilderProps>(...)
   ```

2. **Use type guards**:
   ```typescript
   if (isComponentInstance(data)) {
     // TypeScript knows data is ComponentInstance
   }
   ```

3. **Avoid `any` types**: Use `unknown` or specific types

### Performance

1. **Memoize adapters**: All adapters use React.memo by default
2. **Lazy load heavy components**: Use `createLazyComponent`
3. **Code split by category**: Load components on-demand
4. **Optimize prop transformations**: Cache expensive calculations

### Accessibility

1. **Preserve ARIA attributes**: Pass through from UI components
2. **Add semantic roles**: Use proper HTML semantics
3. **Support keyboard navigation**: Don't break keyboard support
4. **Test with screen readers**: Ensure components are accessible

## Performance

### Lazy Loading

```typescript
const LazyTable = createLazyComponent(
  () => import('@/lib/page-builder/adapters/Table'),
  <LoadingSpinner />
);
```

### Memoization

```typescript
const MemoizedCard = createMemoizedComponent(Card, (prev, next) => {
  return prev.title === next.title && prev.content === next.content;
});
```

### Code Splitting

Components are automatically code-split when using `componentPath`:

```typescript
const definition: ComponentDefinition = {
  id: 'ui-table',
  componentPath: '@/lib/page-builder/adapters/Table',
  // Component loaded on-demand
};
```

## Accessibility

### ARIA Support

```typescript
const instance: ComponentInstance = {
  accessibility: {
    ariaLabel: 'Submit form',
    ariaDescribedBy: 'form-description',
    role: 'button',
    tabIndex: 0,
  },
};
```

### Keyboard Navigation

All interactive components support keyboard navigation:
- **Enter/Space**: Activate buttons
- **Tab**: Navigate between components
- **Arrow keys**: Navigate within compound components

### Screen Reader Support

Components announce their state and changes:
```typescript
<button aria-live="polite" aria-atomic="true">
  {loading ? 'Loading...' : 'Submit'}
</button>
```

## Extension Guide

### Creating Custom Adapters

1. **Create the adapter file**:
   ```typescript
   // adapters/MyComponent.adapter.tsx
   import { createAdapter } from '../utils/createAdapter';
   import { MyComponent } from '@/components/ui/my-component';

   const MyComponentDefinition: ComponentDefinition = {
     id: 'ui-my-component',
     name: 'MyComponent',
     displayName: 'My Component',
     description: 'Description',
     category: 'custom',
     props: [...],
   };

   export const MyComponentAdapter = createAdapter(
     MyComponent,
     MyComponentDefinition,
     {
       transformProps: (props) => props,
     }
   );
   ```

2. **Add to definitions**:
   ```typescript
   // definitions/ui-components.definitions.ts
   import { MyComponentDefinition } from '../adapters/MyComponent.adapter';

   export const UIComponentDefinitions = [
     ...existingDefinitions,
     MyComponentDefinition,
   ];
   ```

3. **Export from index**:
   ```typescript
   // index.ts
   export { MyComponentAdapter, MyComponentDefinition } from './adapters/MyComponent.adapter';
   ```

### Adding New Variants

```typescript
const MyComponentDefinition: ComponentDefinition = {
  // ...
  props: [
    {
      name: 'customVariant',
      label: 'Custom Variant',
      type: 'string',
      controlType: 'select',
      options: [
        { value: 'option1', label: 'Option 1' },
        { value: 'option2', label: 'Option 2' },
      ],
    },
  ],
};
```

### Custom Composition Patterns

```typescript
// Create custom HOC
export function withMyFeature<P>(Component: ComponentType<P>) {
  return function WithMyFeature(props: P) {
    // Add your logic
    return <Component {...props} />;
  };
}

// Use it
const EnhancedComponent = withMyFeature(MyComponent);
```

## Migration Guide

### From Raw Components to Page Builder

**Before**:
```typescript
<Button variant="default" size="lg" onClick={handleClick}>
  Click Me
</Button>
```

**After**:
```typescript
const instance: ComponentInstance = {
  id: 'btn-1',
  componentId: 'ui-button',
  props: { variant: 'default', size: 'lg' },
  events: [
    {
      event: 'onClick',
      actions: [{ type: 'customScript', params: { script: 'handleClick()' } }],
    },
  ],
};

<ButtonAdapter.Component
  instance={instance}
  context={builderContext}
  props={instance.props}
>
  Click Me
</ButtonAdapter.Component>
```

## Troubleshooting

### Common Issues

**Issue**: Component not rendering
- Check if component ID is registered
- Verify props are correctly transformed
- Check console for validation errors

**Issue**: Variants not working
- Verify variant values match CVA definitions
- Check transformProps is mapping variants correctly
- Ensure variant defaults are set

**Issue**: Events not firing
- Check event handler names match
- Verify actions are correctly configured
- Check builder context is provided

## License

MIT
