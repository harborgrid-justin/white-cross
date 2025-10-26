# Storybook Quick Start Guide
## White Cross Healthcare Platform

## Installation (One-Time Setup)

```bash
cd F:/temp/white-cross/nextjs

# Install all Storybook dependencies
chmod +x install-storybook-deps.sh
./install-storybook-deps.sh

# Or install manually:
npm install --save-dev @storybook/nextjs@^9.1.15 @storybook/react@^9.1.15 \
  @storybook/addon-essentials@^9.1.15 @storybook/addon-a11y@^9.1.15 \
  @storybook/addon-interactions@^9.1.15 @storybook/test@^9.1.15 \
  @chromatic-com/storybook@^3.2.2 storybook-dark-mode@^4.0.2 \
  storybook@^9.1.15 style-loader@^4.0.0 css-loader@^7.1.2 postcss-loader@^8.1.1
```

## Daily Usage

### Start Storybook Development Server

```bash
npm run storybook
```

**Access**: http://localhost:6006

### Build for Production

```bash
npm run build-storybook
```

**Output**: `storybook-static/` directory

## Features at a Glance

### 🎨 Interactive Controls
- Adjust component props in real-time
- See immediate visual feedback
- Test all component variants

### ♿ Accessibility Testing
- Built-in axe-core testing
- WCAG 2.1 AA violation detection
- Color contrast checking
- Click "Accessibility" tab in panel

### 📱 Responsive Testing
- Toggle viewport sizes in toolbar
- Test: Mobile (375px), Tablet (768px), Desktop (1280px), Wide (1920px)

### 🌓 Dark Mode
- Toggle in toolbar
- All components support dark theme
- Tailwind CSS dark: classes

### 📚 Documentation
- Auto-generated prop tables
- MDX documentation pages
- Usage examples and code snippets
- Healthcare-specific contexts

## Directory Structure

```
.storybook/           # Configuration
  ├── main.ts         # Main config
  ├── preview.tsx     # Global settings
  └── decorators/     # Context decorators

src/stories/          # MDX documentation
  ├── Introduction.mdx
  ├── DesignSystem.mdx
  └── Accessibility.mdx

src/components/       # Component stories
  ├── ui/
  │   ├── buttons/Button.stories.tsx
  │   ├── inputs/Input.stories.tsx
  │   └── ...
  └── features/
      └── ...
```

## Available Stories

### ✅ Fully Documented (10 stories)
- **Button**: 20+ variants (all sizes, variants, icons, states)
- **Input**: 15+ variants (validation, icons, healthcare examples)
- **Modal**: 10+ variants (sizes, confirmations, forms)
- **Alert**: 5+ variants (info, success, warning, error)
- **Badge**: 10+ variants (status indicators)
- **Card**: 5+ variants (headers, actions)

### 🔧 Template Generated (50+ components)
Templates ready for enhancement:
- UI Inputs, Feedback, Display, Navigation, Charts
- Feature components (Students, Dashboard, Shared)
- Layout components

### 📋 Remaining (100+ components)
Use generation scripts to create templates:

```bash
# Generate specific component stories
ts-node scripts/generate-stories.ts

# Bulk generate all templates
chmod +x scripts/bulk-generate-stories.sh
./scripts/bulk-generate-stories.sh
```

## Common Tasks

### Add a New Story

1. Create `ComponentName.stories.tsx` next to component
2. Use template:

```tsx
import type { Meta, StoryObj } from '@storybook/react';
import { ComponentName } from './ComponentName';

const meta = {
  title: 'Category/ComponentName',
  component: ComponentName,
  tags: ['autodocs'],
} satisfies Meta<typeof ComponentName>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    // Props here
  },
};
```

3. Refresh Storybook to see new story

### Test Accessibility

1. Open story in Storybook
2. Click "Accessibility" tab
3. Review violations
4. Fix issues
5. Re-test

### Deploy to Production

```bash
# Build
npm run build-storybook

# Deploy to Netlify
netlify deploy --dir=storybook-static --prod

# Or GitHub Pages
npm install --save-dev gh-pages
npx gh-pages -d storybook-static

# Or Vercel
vercel --prod
```

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `S` | Toggle sidebar |
| `T` | Toggle toolbar |
| `A` | Toggle addons panel |
| `D` | Toggle dark mode |
| `F` | Toggle fullscreen |
| `/` | Search stories |
| `↑/↓` | Navigate stories |

## Addons Panel

### Tabs Available
- **Controls**: Adjust component props
- **Actions**: View event logs
- **Accessibility**: axe-core violations
- **Interactions**: Test user flows
- **Viewport**: Responsive testing
- **Backgrounds**: Background colors

## Healthcare Context

Many stories include healthcare-specific examples:
- Patient record forms
- Medication administration
- Health record displays
- Emergency alerts
- HIPAA-compliant patterns

## Troubleshooting

### Problem: Storybook won't start

```bash
# Clear cache
rm -rf node_modules/.cache

# Reinstall dependencies
npm install

# Try again
npm run storybook
```

### Problem: Styles not loading

Check `preview.tsx` includes:
```tsx
import '../src/app/globals.css';
```

### Problem: Components not found

Verify import paths use `@/` alias:
```tsx
import { Button } from '@/components/ui/buttons/Button';
```

## Resources

### Documentation
- **Introduction**: Browse in Storybook sidebar
- **Design System**: Color palette, typography, spacing
- **Accessibility**: WCAG guidelines and patterns
- **Storybook Docs**: https://storybook.js.org/docs

### Files
- **Setup Guide**: `STORYBOOK_SETUP.md`
- **Full Report**: `STORYBOOK_IMPLEMENTATION_REPORT.md`
- **Storybook README**: `.storybook/README.md`

## Support

For questions or issues:
- Check troubleshooting section above
- Review documentation files
- Visit Storybook Discord: https://discord.gg/storybook
- GitHub Issues: https://github.com/storybookjs/storybook/issues

---

**Quick Access**

```bash
# Start development
npm run storybook

# Build production
npm run build-storybook

# Generate stories
./scripts/bulk-generate-stories.sh
```

**URL**: http://localhost:6006

**Status**: ✅ Ready to use!
