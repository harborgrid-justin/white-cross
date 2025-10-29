# White Cross Healthcare Platform - Next.js Frontend

> Enterprise-grade Next.js 15 App Router application for healthcare management

## Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Development](#development)
- [Testing](#testing)
- [Deployment](#deployment)
- [Configuration](#configuration)
- [Best Practices](#best-practices)

## Overview

The White Cross Healthcare Platform frontend is built with **Next.js 15** using the **App Router** architecture. It provides a modern, type-safe, and HIPAA-compliant interface for school nurses to manage student health records, medications, and emergency communications.

### Key Technologies

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript 5.9+
- **UI Library**: React 19
- **Styling**: Tailwind CSS 3.4
- **State Management**: Redux Toolkit 2.0 + TanStack Query 5.0
- **GraphQL**: Apollo Client 4.0
- **Testing**: Jest + Playwright
- **UI Components**: Headless UI + Custom Components
- **Build Tool**: SWC (Next.js built-in)

## Architecture

### App Router Structure

Next.js 15 uses the App Router (`app/` directory) with route groups for layout organization:

```
app/
├── (auth)/              # Authentication layout group
│   ├── login/
│   ├── session-expired/
│   └── access-denied/
├── (dashboard)/         # Dashboard layout group (if needed)
├── dashboard/           # Main dashboard
├── students/            # Student management
├── medications/         # Medication tracking
├── appointments/        # Appointment scheduling
├── health-records/      # Health records management
├── incidents/           # Incident reporting
├── inventory/           # Inventory management
├── communication/       # Communications
├── analytics/           # Analytics & reports
└── admin/              # Admin settings
```

### State Management Strategy

**Hybrid Approach**: Redux + TanStack Query

- **Redux Toolkit**: Client state, UI preferences, auth state
- **TanStack Query**: Server state, caching, synchronization
- **Apollo Client**: GraphQL queries and mutations

**HIPAA Compliance**:
- No PHI in `localStorage` (memory or `sessionStorage` only)
- Audit logging for sensitive state access
- Automatic state cleanup on logout

### Data Flow

1. **Server Components** (default): Fetch data on server, SEO-friendly
2. **Client Components** (`'use client'`): Interactive UI, state management
3. **Server Actions**: Mutations, form submissions
4. **API Routes**: Backend proxy, webhooks

## Getting Started

### Prerequisites

- Node.js >= 20.0.0
- npm >= 8.0.0
- Backend API running on port 3001

### Installation

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local

# Update .env.local with your values
```

### Development Server

```bash
# Start development server (port 3000)
npm run dev

# Open browser
open http://localhost:3000
```

### First Time Setup

1. Ensure backend API is running on `http://localhost:3001`
2. Update `.env.local` with correct API URL
3. Run `npm run dev`
4. Navigate to `http://localhost:3000/login`

## Project Structure

```
nextjs/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── (auth)/            # Auth layout group
│   │   ├── dashboard/         # Dashboard pages
│   │   ├── students/          # Student pages
│   │   ├── medications/       # Medication pages
│   │   ├── api/               # API routes
│   │   ├── layout.tsx         # Root layout
│   │   ├── page.tsx           # Home page
│   │   ├── error.tsx          # Global error boundary
│   │   ├── loading.tsx        # Global loading UI
│   │   └── not-found.tsx      # 404 page
│   │
│   ├── components/            # Reusable components
│   │   ├── ui/               # Base UI components
│   │   ├── forms/            # Form components
│   │   └── layouts/          # Layout components
│   │
│   ├── features/             # Feature-based modules
│   │   ├── students/         # Student feature
│   │   ├── medications/      # Medication feature
│   │   └── appointments/     # Appointment feature
│   │
│   ├── lib/                  # Utility libraries
│   │   ├── api/             # API client
│   │   ├── utils/           # Utility functions
│   │   └── validation/      # Validation schemas
│   │
│   ├── stores/              # Redux store
│   │   ├── slices/          # Redux slices
│   │   ├── store.ts         # Store configuration
│   │   └── hooks.ts         # Typed hooks
│   │
│   ├── services/            # API services
│   │   ├── modules/         # Domain services
│   │   └── graphql/         # GraphQL queries
│   │
│   ├── hooks/               # Custom React hooks
│   ├── types/               # TypeScript types
│   ├── constants/           # Constants
│   ├── config/              # Configuration
│   ├── styles/              # Global styles
│   └── middleware.ts        # Next.js middleware
│
├── public/                  # Static assets
├── tests/                   # E2E tests
├── .env.example            # Environment variables template
├── next.config.ts          # Next.js configuration
├── tailwind.config.ts      # Tailwind CSS configuration
├── tsconfig.json           # TypeScript configuration
└── package.json            # Dependencies
```

## Development

### Running the Application

```bash
# Development mode (hot reload)
npm run dev

# Production build
npm run build

# Start production server
npm run start

# Type checking
npm run type-check

# Linting
npm run lint
npm run lint:fix
```

### Code Organization

#### Pages (App Router)

- **Server Components** (default): Static rendering, SEO
- **Client Components**: Interactive UI (`'use client'` directive)
- **Layouts**: Shared UI across routes
- **Loading States**: `loading.tsx` for suspense boundaries
- **Error Boundaries**: `error.tsx` for error handling

#### Components

```typescript
// Server Component (default)
export default function StudentList() {
  const students = await fetchStudents(); // Server-side
  return <div>{/* ... */}</div>;
}

// Client Component
'use client';
export default function StudentForm() {
  const [name, setName] = useState('');
  return <form>{/* ... */}</form>;
}
```

#### API Routes

```typescript
// app/api/example/route.ts
export async function GET(request: Request) {
  // Handle GET request
  return Response.json({ data: [] });
}

export async function POST(request: Request) {
  // Handle POST request
  const body = await request.json();
  return Response.json({ success: true });
}
```

### Import Aliases

Use path aliases for cleaner imports:

```typescript
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/hooks/useAuth';
import { studentsApi } from '@/services/modules/studentsApi';
import type { Student } from '@/types/student';
```

### Styling with Tailwind CSS

```typescript
// Use Tailwind utility classes
<div className="healthcare-card">
  <h2 className="text-2xl font-bold text-gray-900">Title</h2>
  <button className="healthcare-button-primary">
    Click Me
  </button>
</div>

// Custom components defined in tailwind.config.ts:
// - .healthcare-card
// - .healthcare-button-primary
// - .healthcare-button-secondary
// - .status-active
// - .status-warning
// - .status-error
```

## Testing

### Unit Tests (Jest)

```bash
# Run all tests
npm test

# Watch mode
npm run test:watch

# Coverage report
npm run test:coverage
```

### E2E Tests (Playwright)

```bash
# Run E2E tests
npm run test:e2e

# Run in headed mode (see browser)
npm run test:e2e:headed

# Open Playwright UI
npm run playwright:ui

# Debug mode
npm run playwright:debug
```

### Writing Tests

```typescript
// Unit test example
import { render, screen } from '@testing-library/react';
import { Button } from './Button';

describe('Button', () => {
  it('renders button text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });
});

// E2E test example (Playwright)
import { test, expect } from '@playwright/test';

test('login flow', async ({ page }) => {
  await page.goto('/login');
  await page.fill('[name="email"]', 'test@example.com');
  await page.fill('[name="password"]', 'password123');
  await page.click('button[type="submit"]');
  await expect(page).toHaveURL('/dashboard');
});
```

## Deployment

### Production Build

```bash
# Build for production
npm run build

# Test production build locally
npm run start
```

### Docker Deployment

```dockerfile
# Multi-stage build
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/static ./.next/static
EXPOSE 3000
CMD ["node", "server.js"]
```

### Environment Variables

**Production Checklist**:
- ✅ Set `NODE_ENV=production`
- ✅ Configure `NEXT_PUBLIC_API_BASE_URL`
- ✅ Set up monitoring (Sentry, DataDog)
- ✅ Enable HTTPS-only cookies
- ✅ Configure CSP headers
- ✅ Set up rate limiting
- ✅ Enable audit logging

## Configuration

### next.config.ts

Key configurations:
- API rewrites (proxy to backend)
- Security headers (HIPAA-compliant)
- Image optimization
- Bundle optimization
- TypeScript strict mode

See `next.config.enhanced.ts` for production-ready configuration.

### tailwind.config.ts

- Healthcare color palette
- Custom components
- Responsive breakpoints
- Animations
- Typography system

### tsconfig.json

- Strict TypeScript mode
- Path aliases (`@/*`)
- Next.js plugin integration
- JSX configuration

## Best Practices

### Server vs Client Components

**Use Server Components for**:
- Static content
- Data fetching
- SEO-critical pages
- Reducing JavaScript bundle size

**Use Client Components for**:
- Interactivity (onClick, onChange)
- State management (useState, useReducer)
- Browser APIs (localStorage, window)
- React hooks (useEffect)

### Data Fetching

```typescript
// Server Component - Fetch on server
async function StudentPage({ params }: { params: { id: string } }) {
  const student = await fetchStudent(params.id);
  return <StudentDetails student={student} />;
}

// Client Component - Use React Query
'use client';
function StudentList() {
  const { data, isLoading } = useQuery({
    queryKey: ['students'],
    queryFn: fetchStudents,
  });

  if (isLoading) return <Loading />;
  return <List data={data} />;
}
```

### State Management

- **Redux**: Auth state, UI preferences, cross-page state
- **TanStack Query**: Server data, caching
- **useState**: Local component state
- **URL State**: Filters, pagination (useSearchParams)

### Performance Optimization

1. **Code Splitting**: Use dynamic imports
   ```typescript
   const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
     loading: () => <Loading />,
   });
   ```

2. **Image Optimization**: Use `next/image`
   ```typescript
   import Image from 'next/image';
   <Image src="/logo.png" width={200} height={100} alt="Logo" />
   ```

3. **Font Optimization**: Use `next/font`
   ```typescript
   import { Inter } from 'next/font/google';
   const inter = Inter({ subsets: ['latin'] });
   ```

4. **Metadata**: Use Next.js metadata API
   ```typescript
   export const metadata = {
     title: 'Page Title',
     description: 'Page description',
   };
   ```

### Security

- ✅ Validate all user inputs (Zod schemas)
- ✅ Sanitize data before rendering
- ✅ Use HTTPS in production
- ✅ Implement CSP headers
- ✅ Never log PHI data
- ✅ Use secure cookies
- ✅ Implement rate limiting
- ✅ Regular dependency updates

### Accessibility

- ✅ Semantic HTML
- ✅ ARIA labels
- ✅ Keyboard navigation
- ✅ Screen reader support
- ✅ Color contrast (WCAG AAA)
- ✅ Focus indicators

## Troubleshooting

### Common Issues

**Port already in use**:
```bash
lsof -ti:3000 | xargs kill -9
```

**Module not found**:
```bash
rm -rf node_modules package-lock.json
npm install
```

**Type errors**:
```bash
npm run type-check
```

**Build errors**:
```bash
rm -rf .next
npm run build
```

## Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Redux Toolkit](https://redux-toolkit.js.org)
- [TanStack Query](https://tanstack.com/query)
- [TypeScript](https://www.typescriptlang.org/docs)

## License

Proprietary - White Cross Healthcare Platform

---

**For questions or support**, contact the development team.
