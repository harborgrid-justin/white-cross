# White Cross Storybook

Comprehensive component documentation for the White Cross Healthcare Platform.

## Overview

This Storybook instance documents 162+ React components used across the White Cross healthcare platform, including:

- **40+ UI Components**: Buttons, inputs, forms, feedback, overlays, navigation, charts
- **70+ Feature Components**: Student management, medications, health records, appointments, communication, inventory
- **15+ Layout Components**: Application shell, navigation, headers, footers

## Quick Start

### Development

Start Storybook in development mode:

```bash
npm run storybook
```

This will start Storybook at `http://localhost:6006`

### Production Build

Build static Storybook for deployment:

```bash
npm run build-storybook
```

This creates a static build in `storybook-static/` that can be deployed to any static hosting service.

## Features

### Interactive Controls

All component stories include interactive controls in the Controls panel:
- Adjust props in real-time
- See component behavior with different values
- Test edge cases and states

### Accessibility Testing

Built-in accessibility testing with axe-core:
- A11y panel shows WCAG violations
- Automated accessibility checks
- Color contrast verification
- ARIA attribute validation

### Responsive Testing

Viewport addon allows testing across different screen sizes:
- Mobile (375px)
- Tablet (768px)
- Desktop (1280px)
- Wide Screen (1920px)

### Dark Mode Support

Toggle between light and dark themes:
- All components support dark mode
- Theme switcher in toolbar
- Tailwind CSS dark: classes

### Documentation

Comprehensive documentation includes:
- Component descriptions
- Prop tables with types
- Usage examples
- Accessibility notes
- Healthcare-specific contexts

## Configuration

### Main Configuration

`.storybook/main.ts` contains:
- Story file patterns
- Addon configuration
- Webpack customization
- TypeScript settings

### Preview Configuration

`.storybook/preview.tsx` contains:
- Global decorators (Redux, React Query, Router, Theme)
- Default parameters
- Viewport configurations
- Dark mode settings

### Decorators

Custom decorators in `.storybook/decorators/`:
- `ReduxDecorator`: Redux store with mock state
- `QueryClientDecorator`: TanStack Query client
- `RouterDecorator`: Next.js router mock
- `ThemeDecorator`: Dark mode and theme switching

## Addons

### Installed Addons

- **@storybook/addon-essentials**: Core addons (controls, actions, docs, etc.)
- **@storybook/addon-a11y**: Accessibility testing
- **@storybook/addon-interactions**: Component interaction testing
- **@chromatic-com/storybook**: Visual regression testing
- **storybook-dark-mode**: Dark mode toggle
- **@storybook/addon-viewport**: Responsive testing
- **@storybook/addon-backgrounds**: Background color testing

## Story Organization

Stories are organized by category:

### UI Components

```
UI/
├── Buttons/
│   ├── Button
│   ├── BackButton
│   └── RollbackButton
├── Inputs/
│   ├── Input
│   ├── Checkbox
│   ├── Radio
│   ├── Select
│   └── ...
├── Feedback/
├── Overlays/
├── Display/
├── Navigation/
├── Charts/
└── Layout/
```

### Feature Components

```
Features/
├── Students/
├── Medications/
├── Health Records/
├── Dashboard/
├── Communication/
├── Inventory/
├── Settings/
└── Shared/
```

### Layout Components

```
Layout/
├── AppLayout
├── Sidebar
├── Navigation
├── PageHeader
├── PageContainer
└── Footer
```

## Writing Stories

### Basic Story Template

```tsx
import type { Meta, StoryObj } from '@storybook/react';
import { ComponentName } from './ComponentName';

const meta = {
  title: 'Category/ComponentName',
  component: ComponentName,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Component description.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    // Define controls
  },
} satisfies Meta<typeof ComponentName>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    // Default props
  },
};
```

### Story with Render Function

```tsx
export const Interactive: Story = {
  render: (args) => {
    const [state, setState] = useState(false);
    return (
      <ComponentName
        {...args}
        open={state}
        onClose={() => setState(false)}
      />
    );
  },
};
```

## MDX Documentation

MDX documentation pages in `src/stories/`:

- **Introduction.mdx**: Platform overview and getting started
- **DesignSystem.mdx**: Colors, typography, spacing, shadows
- **Accessibility.mdx**: WCAG guidelines and best practices

## Healthcare Context

Many components include healthcare-specific examples:

- Patient record forms
- Medication administration workflows
- Health record displays
- Emergency alert systems
- HIPAA-compliant data handling

## Testing

### Automated Accessibility

All stories are automatically tested for accessibility:
- Run `npm run storybook`
- Check A11y panel for violations
- Fix issues before deployment

### Visual Regression

Use Chromatic for visual regression testing:
- Automated screenshot comparisons
- Detect unintended visual changes
- Review changes before merge

### Interaction Testing

Test component interactions:
- Use `@storybook/addon-interactions`
- Write play functions for user flows
- Test forms, modals, and complex UIs

## Deployment

### Static Hosting

Deploy to Netlify, Vercel, or GitHub Pages:

```bash
# Build Storybook
npm run build-storybook

# Deploy storybook-static/ directory
```

### GitHub Pages

```bash
# Build
npm run build-storybook

# Deploy (using gh-pages package)
npx gh-pages -d storybook-static
```

### Netlify

```bash
# Build command
npm run build-storybook

# Publish directory
storybook-static
```

## Maintenance

### Adding New Components

1. Create component in `src/components/`
2. Create story file `ComponentName.stories.tsx`
3. Add documentation and examples
4. Test accessibility
5. Commit both files

### Updating Stories

1. Update component implementation
2. Update story examples
3. Verify controls and interactions
4. Test in Storybook UI
5. Build and deploy

## Troubleshooting

### Build Errors

- Clear cache: `rm -rf node_modules/.cache`
- Reinstall dependencies: `npm install`
- Check TypeScript errors: `npm run type-check`

### Missing Components

- Verify import paths
- Check component exports
- Ensure story file pattern matches `.storybook/main.ts`

### Styling Issues

- Verify Tailwind CSS is loaded
- Check `globals.css` import in `preview.tsx`
- Test dark mode classes

## Resources

- [Storybook Documentation](https://storybook.js.org/docs)
- [Next.js Integration](https://storybook.js.org/docs/react/get-started/nextjs)
- [Accessibility Addon](https://storybook.js.org/addons/@storybook/addon-a11y)
- [Component Story Format](https://storybook.js.org/docs/react/api/csf)

---

**Version**: 9.1.15
**Framework**: Next.js 15 + React 19
**Last Updated**: October 26, 2025
