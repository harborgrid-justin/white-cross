# Architecture Notes - Link Component Type Safety (L8Y4T6)

## References to Other Agent Work
- SF7K3W: Previous Next.js best practices implementation
- C4D9F2: Component architecture updates

## Issues Discovered

### 1. Navigation.tsx - Critical Routing Bug
**Problem**: Using react-router-dom API instead of Next.js Link API
- Using `to` prop instead of `href`
- This is a migration artifact from react-router-dom to Next.js
- TypeScript may not catch this if @types are misconfigured

**Impact**:
- Links may not work correctly in production
- Client-side navigation broken
- Potential runtime errors

**Solution**: Replace all `to={...}` with `href={...}`

### 2. EmptyState.tsx - Accessibility Anti-Pattern
**Problem**: Wrapping Button component inside Link component
```tsx
// Current (incorrect)
<Link href={href}>
  <Button variant="primary">Click</Button>
</Link>
```

**Issues**:
- Nested interactive elements (accessibility violation)
- Duplicate tab stops
- Confusing for screen readers
- Not semantic HTML

**Solutions**:
1. Use Link directly with button styling
2. Extend Button to accept `href` and render as Link
3. Use conditional rendering based on `href` presence

**Chosen Solution**: Conditional rendering with Link styled as button

### 3. Type Safety Gaps

**Current State**:
- No usage of `ComponentProps<typeof Link>` in codebase
- Link props not properly typed in custom components
- Missing type safety for Link prop forwarding

**Best Practices to Establish**:
```typescript
// For components that wrap Link
import { ComponentProps } from 'react';
import Link from 'next/link';

type LinkProps = ComponentProps<typeof Link>;

interface CustomLinkProps extends Omit<LinkProps, 'href'> {
  href: string;
  // additional props
}
```

## Type System Strategy

### Link Component Props
Next.js Link accepts these key props:
- `href`: string | UrlObject (required)
- `as?: string | UrlObject` (optional)
- `replace?: boolean` (default: false)
- `scroll?: boolean` (default: true)
- `shallow?: boolean` (deprecated in App Router)
- `passHref?: boolean` (legacy)
- `prefetch?: boolean` (default: true)
- `locale?: string | false`

### Proper Typing Pattern
```typescript
import { ComponentProps } from 'react';
import Link from 'next/link';

// Extract Link props
type NextLinkProps = ComponentProps<typeof Link>;

// Extend for custom wrapper
interface CustomLinkWrapperProps extends NextLinkProps {
  variant?: 'primary' | 'secondary';
  // custom props
}
```

## Performance Considerations

### Prefetch Behavior
- Default: `prefetch={true}` in production
- Links prefetch on hover/viewport entry
- Can be disabled with `prefetch={false}`
- Type: `boolean | undefined`

### Scroll Behavior
- Default: `scroll={true}` (scrolls to top on navigation)
- Type: `boolean | undefined`
- Commonly set to `false` for in-page updates

## Integration Patterns

### With Router
```typescript
import { useRouter } from 'next/navigation';

const router = useRouter();
router.push(href, { scroll: false }); // Correctly typed
```

### With Buttons
```typescript
// Incorrect (nested interactive)
<Link href="/path">
  <Button>Click</Button>
</Link>

// Correct (conditional)
{href ? (
  <Link href={href} className={buttonStyles}>
    {children}
  </Link>
) : (
  <button onClick={onClick} className={buttonStyles}>
    {children}
  </button>
)}
```

## Security Requirements

### href Validation
- Always validate external URLs
- Use relative paths for internal navigation
- Sanitize dynamic href values
- Type href as `string` not `any`

### Type Safety
- Enforce `href` as required prop
- Use discriminated unions for Link vs Button
- Avoid `any` in Link-related types
