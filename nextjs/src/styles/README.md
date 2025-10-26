# White Cross Design System - Design Tokens

## Overview

This directory contains the design tokens for the White Cross Healthcare Platform. Design tokens are the single source of truth for design decisions, providing a consistent visual language across the entire application.

## Files

- **tokens.css** - Comprehensive design token definitions using CSS custom properties
- Reference this file in your global styles to use design tokens

## Token Categories

### 1. Color Tokens

#### Primary Colors (Healthcare Blue)
Trust and professionalism. Used for primary actions, links, and brand elements.

```css
var(--color-primary-500)  /* Main primary color */
var(--color-primary-600)  /* Hover state */
var(--color-primary-700)  /* Active state */
```

**Shades**: 50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950

#### Secondary Colors (Medical Teal)
Health and wellness. Used for secondary actions and accents.

```css
var(--color-secondary-500)  /* Main secondary color */
```

**Shades**: 50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950

#### Semantic Colors

##### Success (Healthcare Green)
Healthy, positive outcomes, successful actions.

```css
var(--color-success-500)  /* Main success color */
var(--color-success-600)  /* Darker variant */
```

##### Warning (Alert Orange)
Caution, attention needed, non-critical alerts.

```css
var(--color-warning-500)  /* Main warning color */
var(--color-warning-600)  /* Darker variant */
```

##### Error (Critical Red)
Danger, errors, critical alerts.

```css
var(--color-error-500)  /* Main error color */
var(--color-error-600)  /* Darker variant */
```

##### Info (Informational Blue)
Information, neutral alerts, helpful tips.

```css
var(--color-info-500)  /* Main info color */
var(--color-info-600)  /* Darker variant */
```

#### Healthcare-Specific Colors

```css
var(--color-medication)       /* Purple - Medications */
var(--color-allergy)          /* Red - Allergies/Alerts */
var(--color-vaccination)      /* Green - Vaccinations */
var(--color-condition)        /* Amber - Conditions */
var(--color-vital-signs)      /* Cyan - Vital Signs */
```

Each has a light and dark variant:

```css
var(--color-medication-light)
var(--color-medication-dark)
```

#### Neutral Colors (Gray)

UI foundation colors for text, borders, backgrounds.

```css
var(--color-neutral-500)  /* Mid-gray */
var(--color-neutral-700)  /* Dark gray */
```

**Shades**: 50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950

### 2. Typography Tokens

#### Font Families

```css
var(--font-sans)  /* Inter, system-ui, sans-serif */
var(--font-mono)  /* JetBrains Mono, monospace */
```

#### Font Sizes (Type Scale)

Minimum 16px for body text (WCAG compliance).

```css
var(--text-xs)     /* 12px - Captions, labels */
var(--text-sm)     /* 14px - Small text */
var(--text-base)   /* 16px - Body text (default) */
var(--text-lg)     /* 18px - Large body text */
var(--text-xl)     /* 20px - Small headings */
var(--text-2xl)    /* 24px - Headings */
var(--text-3xl)    /* 30px - Large headings */
var(--text-4xl)    /* 36px - Display headings */
var(--text-5xl)    /* 48px - Hero text */
var(--text-6xl)    /* 60px - Extra large display */
```

#### Line Heights

```css
var(--leading-none)      /* 1 - Tight, for headings */
var(--leading-tight)     /* 1.25 - Headings */
var(--leading-snug)      /* 1.375 - Subheadings */
var(--leading-normal)    /* 1.5 - Body text (recommended) */
var(--leading-relaxed)   /* 1.625 - Readable paragraphs */
var(--leading-loose)     /* 2 - Very relaxed */
```

#### Font Weights

```css
var(--font-normal)     /* 400 - Body text */
var(--font-medium)     /* 500 - Emphasis */
var(--font-semibold)   /* 600 - Subheadings */
var(--font-bold)       /* 700 - Headings */
```

**All weights**: thin (100), extralight (200), light (300), normal (400), medium (500), semibold (600), bold (700), extrabold (800), black (900)

### 3. Spacing Tokens

Based on a 4px grid system for consistent spacing.

```css
var(--space-0)    /* 0 */
var(--space-1)    /* 4px */
var(--space-2)    /* 8px */
var(--space-3)    /* 12px */
var(--space-4)    /* 16px */
var(--space-5)    /* 20px */
var(--space-6)    /* 24px */
var(--space-8)    /* 32px */
var(--space-10)   /* 40px */
var(--space-12)   /* 48px */
var(--space-16)   /* 64px */
var(--space-20)   /* 80px */
```

**Full scale**: 0, px, 0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 5, 6, 7, 8, 9, 10, 11, 12, 14, 16, 20, 24, 28, 32

### 4. Border Radius Tokens

```css
var(--radius-none)   /* 0 - Sharp corners */
var(--radius-sm)     /* 2px - Subtle rounding */
var(--radius-base)   /* 4px - Default */
var(--radius-md)     /* 6px - Medium */
var(--radius-lg)     /* 8px - Large (cards) */
var(--radius-xl)     /* 12px - Extra large */
var(--radius-2xl)    /* 16px - Very large */
var(--radius-3xl)    /* 24px - Extremely large */
var(--radius-full)   /* 9999px - Circular/pill */
```

### 5. Shadow Tokens (Elevation)

Six levels of elevation for depth and hierarchy.

```css
var(--shadow-xs)    /* Subtle shadow */
var(--shadow-sm)    /* Small elevation */
var(--shadow-base)  /* Default elevation */
var(--shadow-md)    /* Medium elevation */
var(--shadow-lg)    /* Large elevation (cards) */
var(--shadow-xl)    /* Extra large elevation */
var(--shadow-2xl)   /* Maximum elevation (modals) */
```

#### Custom Healthcare Shadows

```css
var(--shadow-card)         /* Card default */
var(--shadow-card-hover)   /* Card hover state */
var(--shadow-modal)        /* Modal dialogs */
var(--shadow-dropdown)     /* Dropdown menus */
```

### 6. Animation Tokens

#### Duration

```css
var(--duration-instant)   /* 0ms - No animation */
var(--duration-fast)      /* 150ms - Quick interactions */
var(--duration-normal)    /* 300ms - Standard (default) */
var(--duration-slow)      /* 500ms - Deliberate animations */
var(--duration-slower)    /* 700ms - Slow transitions */
var(--duration-slowest)   /* 1000ms - Very slow */
```

#### Easing Functions

```css
var(--ease-linear)     /* Linear - Constant speed */
var(--ease-in)         /* Ease-in - Start slow */
var(--ease-out)        /* Ease-out - End slow (entrances) */
var(--ease-in-out)     /* Ease-in-out - Both (default) */
var(--ease-bounce)     /* Bounce - Playful */
var(--ease-elastic)    /* Elastic - Spring-like */
```

### 7. Z-Index Tokens

Layering system for overlays and fixed elements.

```css
var(--z-0)               /* 0 - Base layer */
var(--z-10)              /* 10 - Above base */
var(--z-dropdown)        /* 1000 - Dropdowns */
var(--z-sticky)          /* 1020 - Sticky elements */
var(--z-fixed)           /* 1030 - Fixed elements */
var(--z-modal-backdrop)  /* 1040 - Modal backdrop */
var(--z-modal)           /* 1050 - Modal dialogs */
var(--z-popover)         /* 1060 - Popovers */
var(--z-tooltip)         /* 1070 - Tooltips */
var(--z-notification)    /* 1080 - Notifications */
```

### 8. Breakpoint Tokens

Responsive design breakpoints.

```css
var(--breakpoint-xs)   /* 475px - Extra small */
var(--breakpoint-sm)   /* 640px - Small (mobile) */
var(--breakpoint-md)   /* 768px - Medium (tablet) */
var(--breakpoint-lg)   /* 1024px - Large (desktop) */
var(--breakpoint-xl)   /* 1280px - Extra large */
var(--breakpoint-2xl)  /* 1536px - 2X extra large */
var(--breakpoint-3xl)  /* 1920px - 3X extra large */
```

## Usage Examples

### Colors

```css
/* Button with primary color */
.button {
  background-color: var(--color-primary-500);
  color: var(--color-text-inverse);
}

.button:hover {
  background-color: var(--color-primary-600);
}

/* Alert with semantic color */
.alert-success {
  background-color: var(--color-success-50);
  color: var(--color-success-700);
  border: var(--border-1) solid var(--color-success-500);
}
```

### Typography

```css
/* Heading */
h1 {
  font-size: var(--text-4xl);
  font-weight: var(--font-bold);
  line-height: var(--leading-tight);
  color: var(--color-text-primary);
}

/* Body text */
p {
  font-size: var(--text-base);
  line-height: var(--leading-normal);
  color: var(--color-text-secondary);
}
```

### Spacing

```css
/* Card with consistent spacing */
.card {
  padding: var(--space-6);
  margin-bottom: var(--space-4);
  gap: var(--space-4);
}
```

### Elevation and Shadows

```css
/* Elevated card */
.card {
  box-shadow: var(--shadow-card);
  border-radius: var(--radius-lg);
  transition: box-shadow var(--duration-normal) var(--ease-out);
}

.card:hover {
  box-shadow: var(--shadow-card-hover);
}
```

### Animations

```css
/* Smooth transition */
.button {
  transition: all var(--duration-normal) var(--ease-in-out);
}

/* Entrance animation */
.modal {
  animation: fadeIn var(--duration-slow) var(--ease-out);
}
```

## Accessibility Considerations

### Color Contrast

All color combinations meet WCAG 2.1 Level AA requirements:
- **Normal text** (< 18pt): 4.5:1 contrast ratio
- **Large text** (≥ 18pt or 14pt bold): 3:1 contrast ratio
- **UI components**: 3:1 contrast ratio

### Reduced Motion

Design tokens automatically respect `prefers-reduced-motion`:

```css
@media (prefers-reduced-motion: reduce) {
  /* Animations reduced to near-instant */
}
```

### Touch Targets

Minimum touch target size for accessibility:

```css
var(--touch-target-min)  /* 44px minimum */
```

### Focus Indicators

Visible focus indicators for keyboard navigation:

```css
var(--focus-ring)        /* 2px solid primary-500 */
var(--focus-ring-offset) /* 2px offset */
```

## Dark Mode Support

Dark mode is supported via the `.dark` class or `[data-theme="dark"]` attribute:

```css
.dark {
  /* Adjusted colors for dark mode */
  --color-background: #0f172a;
  --color-foreground: #f1f5f9;
  /* Shadows adjusted for better visibility */
}
```

## Healthcare-Specific Guidelines

### Color Usage for Healthcare Data

- **Medications**: Use `var(--color-medication)` purple
- **Allergies**: Use `var(--color-allergy)` red (high contrast for critical info)
- **Vaccinations**: Use `var(--color-vaccination)` green
- **Conditions**: Use `var(--color-condition)` amber
- **Vital Signs**: Use `var(--color-vital-signs)` cyan

### Critical Information

For critical healthcare information (allergies, medication conflicts):
- Use `var(--color-error)` or `var(--color-allergy)`
- Combine color with icon and text (don't rely on color alone)
- Use increased contrast (`var(--color-error-700)` on `var(--color-error-50)`)

### HIPAA Compliance

When displaying PHI (Protected Health Information):
- Use appropriate elevation (`var(--shadow-md)` or higher)
- Consider using `var(--color-background-secondary)` for sensitive data containers
- Ensure proper contrast for readability

## Tailwind Integration

These tokens integrate with Tailwind CSS. Use them in your tailwind.config.ts:

```typescript
theme: {
  extend: {
    colors: {
      primary: {
        500: 'var(--color-primary-500)',
        // ... other shades
      },
    },
    spacing: {
      'custom': 'var(--space-custom)',
    },
  },
}
```

Or use them directly in your CSS:

```css
.my-component {
  color: var(--color-primary-500);
  padding: var(--space-4);
  border-radius: var(--radius-lg);
}
```

## Best Practices

1. **Always use design tokens** instead of hardcoded values
2. **Use semantic color names** (success, warning, error) instead of specific colors (green, orange, red)
3. **Respect spacing scale** - stick to the 4px grid system
4. **Test accessibility** - verify color contrast, keyboard navigation, screen reader support
5. **Consider dark mode** - ensure colors work in both light and dark themes
6. **Use appropriate elevation** - cards should have subtle shadows, modals should have prominent shadows
7. **Animate purposefully** - use animations to provide feedback and guide attention
8. **Respect user preferences** - honor prefers-reduced-motion and prefers-contrast

## Contributing

When adding new design tokens:

1. Follow the existing naming convention
2. Ensure WCAG 2.1 AA compliance for colors
3. Test in both light and dark modes
4. Document the token and its usage
5. Update this README with examples

## Resources

- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [Color Contrast Checker](https://webaim.org/resources/contrastchecker/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [CSS Custom Properties (MDN)](https://developer.mozilla.org/en-US/docs/Web/CSS/--*)

## Version History

- **v1.0.0** (2025-10-26): Initial design token system
  - Comprehensive color palette
  - Typography scale
  - Spacing system (4px grid)
  - Shadow/elevation system
  - Animation tokens
  - Healthcare-specific semantic colors
  - Dark mode support
  - Accessibility considerations
