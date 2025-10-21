# White Cross Frontend

Enterprise-grade React application for school nurse healthcare management.

## Overview

The White Cross frontend is a modern, type-safe React application built with cutting-edge technologies and best practices for healthcare data management. It features comprehensive state management, permission-based routing, and HIPAA-compliant data handling.

## Technology Stack

### Core
- **React 18**: Latest React with concurrent features
- **TypeScript 5**: Strict type safety throughout
- **Vite 4**: Lightning-fast build tool and dev server
- **React Router v6**: Modern declarative routing

### State Management
- **Redux Toolkit**: Global application state
- **Context API**: Feature-specific state management
- **TanStack Query (React Query)**: Server state, caching, and synchronization

### UI & Styling
- **Tailwind CSS**: Utility-first CSS framework
- **React Hot Toast**: Beautiful toast notifications
- **React Icons**: Comprehensive icon library

### Forms & Validation
- **React Hook Form**: Performant form management
- **Zod**: TypeScript-first schema validation

### Testing
- **Vitest**: Fast unit and integration testing
- **React Testing Library**: Component testing utilities
- **Cypress**: End-to-end testing
- **MSW**: API mocking

### Development Tools
- **ESLint**: Code linting
- **Prettier**: Code formatting
- **Redux DevTools**: State debugging
- **React Query DevTools**: Query debugging

## Documentation

### Core Documentation
- **[Integration Complete Guide](./src/INTEGRATION_COMPLETE.md)** - Comprehensive overview of all state management and routing features
- **[State Management Architecture](./src/STATE_MANAGEMENT_ARCHITECTURE.md)** - Deep dive into architecture, patterns, and best practices
- **[Testing Guide](./src/TESTING_GUIDE.md)** - Complete testing strategies and examples
- **[Quick Start Guide](./src/QUICK_START.md)** - New developer onboarding and common patterns

### Feature Documentation
- **[Redux Incident Reports Slice](./src/stores/slices/INCIDENT_REPORTS_SLICE_README.md)** - Incident reports state management
- **[Witness Statement Context](./src/contexts/WitnessStatementContext.README.md)** - Witness statements feature
- **[Follow-Up Action Context](./src/contexts/FollowUpActionContext.README.md)** - Follow-up actions feature
- **[Navigation Guards](./src/guards/README.md)** - Permission-based routing system

### Quick References
- **[Navigation Guards Quick Reference](./src/guards/QUICK_REFERENCE.md)**
- **[Witness Statement Quick Reference](./src/contexts/WitnessStatementContext.QUICKREF.md)**

## Project Structure

```
frontend/
├── public/                 # Static assets
├── src/
│   ├── components/        # Reusable UI components
│   │   ├── shared/       # Shared components
│   │   ├── modals/       # Modal components
│   │   └── ...           # Feature-specific components
│   │
│   ├── pages/            # Route-level page components
│   │   ├── Dashboard.tsx
│   │   ├── IncidentReports.tsx
│   │   ├── Students.tsx
│   │   └── ...
│   │
│   ├── stores/           # Redux state management
│   │   ├── reduxStore.ts      # Store configuration
│   │   ├── hooks/             # Typed Redux hooks
│   │   └── slices/            # Redux slices
│   │       ├── authSlice.ts
│   │       ├── incidentReportsSlice.ts
│   │       └── ...
│   │
│   ├── contexts/         # Context API providers
│   │   ├── AuthContext.tsx
│   │   ├── WitnessStatementContext.tsx
│   │   ├── FollowUpActionContext.tsx
│   │   └── ...
│   │
│   ├── guards/           # Navigation guards & permissions
│   │   ├── navigationGuards.tsx
│   │   └── ...
│   │
│   ├── services/         # API services
│   │   ├── modules/      # Feature-specific API modules
│   │   └── index.ts      # Service exports
│   │
│   ├── hooks/            # Custom React hooks
│   │   ├── useDebounce.ts
│   │   ├── useMedicationsData.ts
│   │   └── ...
│   │
│   ├── types/            # TypeScript type definitions
│   │   ├── incidents.ts
│   │   ├── students.ts
│   │   ├── index.ts
│   │   └── ...
│   │
│   ├── utils/            # Utility functions
│   ├── constants/        # Application constants
│   ├── routes/           # Route configurations
│   ├── middleware/       # Redux middleware
│   │
│   ├── App.tsx           # Root application component
│   ├── main.tsx          # Application entry point
│   │
│   ├── INTEGRATION_COMPLETE.md      # Integration documentation
│   ├── STATE_MANAGEMENT_ARCHITECTURE.md  # Architecture guide
│   ├── TESTING_GUIDE.md             # Testing guide
│   └── QUICK_START.md               # Quick start guide
│
├── tests/                # Test utilities and setup
├── cypress/              # E2E tests
├── .env.example          # Environment variables template
├── vite.config.ts        # Vite configuration
├── tsconfig.json         # TypeScript configuration
├── tailwind.config.js    # Tailwind CSS configuration
└── package.json          # Dependencies and scripts
```

## Getting Started

### Prerequisites

- Node.js 18 or higher
- npm 9 or higher
- Backend API running on http://localhost:3001

### Installation

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local

# Start development server
npm run dev
```

The application will be available at http://localhost:5173

### Environment Variables

```env
VITE_API_URL=http://localhost:3001/api
VITE_APP_NAME=White Cross
VITE_APP_VERSION=1.0.0
```

## Available Scripts

### Development
```bash
npm run dev              # Start development server
npm run build           # Build for production
npm run preview         # Preview production build
npm run type-check      # Run TypeScript type checking
```

### Testing
```bash
npm test                # Run unit tests
npm run test:watch      # Run tests in watch mode
npm run test:coverage   # Generate coverage report
npm run test:e2e        # Run Cypress E2E tests
npm run test:e2e:open   # Open Cypress in interactive mode
```

### Code Quality
```bash
npm run lint            # Run ESLint
npm run lint:fix        # Fix linting issues
npm run format          # Format code with Prettier
npm run analyze         # Analyze bundle size
```

## State Management

The application uses a **hybrid state management approach**:

### Redux (Global State)
Used for application-wide state that needs to be accessed across the entire app:
- Authentication state
- Incident reports
- Application settings
- Theme preferences

```typescript
import { useAppDispatch, useAppSelector } from '@/stores/hooks/reduxHooks';
import { fetchIncidentReports, selectIncidentReports } from '@/stores/slices/incidentReportsSlice';

function MyComponent() {
  const dispatch = useAppDispatch();
  const reports = useAppSelector(selectIncidentReports);

  useEffect(() => {
    dispatch(fetchIncidentReports());
  }, [dispatch]);
}
```

### Context API (Feature State)
Used for feature-specific state shared across a component subtree:
- Witness statements
- Follow-up actions
- Form wizards

```typescript
import { useWitnessStatements } from '@/contexts/WitnessStatementContext';

function MyComponent() {
  const { statements, createWitnessStatement, isLoading } = useWitnessStatements();
}
```

### TanStack Query (Server State)
Used for data fetching, caching, and synchronization:
- API data fetching
- Automatic refetching
- Optimistic updates
- Cache management

```typescript
import { useQuery, useMutation } from '@tanstack/react-query';

function MyComponent() {
  const { data, isLoading } = useQuery({
    queryKey: ['students'],
    queryFn: () => studentsApi.getAll(),
  });
}
```

## Routing & Navigation

The application uses React Router v6 with custom navigation guards for permission-based access control.

### Navigation Guards

```typescript
import { composeGuards, withAuthGuard, withRoleGuard } from '@/guards/navigationGuards';

// Protect a page with authentication and role checks
const AdminPage = composeGuards([
  withAuthGuard,
  withRoleGuard(['ADMIN', 'DISTRICT_ADMIN'])
])(AdminPageComponent);
```

### Permission System

Role-based permissions:
- **ADMIN / DISTRICT_ADMIN**: Full system access
- **SCHOOL_ADMIN**: School-level management
- **NURSE**: Healthcare operations
- **COUNSELOR**: Limited read access
- **READ_ONLY**: View-only access

## API Integration

API services are organized by feature in `src/services/modules/`:

```typescript
// services/modules/incidentReportsApi.ts
export const incidentReportsApi = {
  getAll: (filters?: Filters) => axios.get('/incident-reports', { params: filters }),
  getById: (id: string) => axios.get(`/incident-reports/${id}`),
  create: (data: CreateRequest) => axios.post('/incident-reports', data),
  update: (id: string, data: UpdateRequest) => axios.put(`/incident-reports/${id}`, data),
  delete: (id: string) => axios.delete(`/incident-reports/${id}`),
};
```

## Testing

### Unit Tests (Vitest)
```bash
npm test
```

```typescript
import { renderHook } from '@testing-library/react';
import { useDebounce } from './useDebounce';

describe('useDebounce', () => {
  it('should debounce value changes', async () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 500),
      { initialProps: { value: 'initial' } }
    );

    rerender({ value: 'updated' });

    await waitFor(() => {
      expect(result.current).toBe('updated');
    });
  });
});
```

### Integration Tests (React Testing Library)
```typescript
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

test('should create incident report', async () => {
  const user = userEvent.setup();
  render(<IncidentReportForm />);

  await user.type(screen.getByLabelText('Description'), 'Test incident');
  await user.click(screen.getByText('Submit'));

  expect(screen.getByText('Report created')).toBeInTheDocument();
});
```

### E2E Tests (Cypress)
```typescript
describe('Incident Reports', () => {
  it('should create a new incident report', () => {
    cy.visit('/incident-reports');
    cy.get('[data-testid="create-button"]').click();
    cy.get('[data-testid="description"]').type('Test incident');
    cy.get('[data-testid="submit"]').click();
    cy.contains('Report created successfully').should('be.visible');
  });
});
```

## Performance Optimization

### Code Splitting
```typescript
import { lazy, Suspense } from 'react';

const IncidentReports = lazy(() => import('./pages/IncidentReports'));

function App() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Routes>
        <Route path="/incidents" element={<IncidentReports />} />
      </Routes>
    </Suspense>
  );
}
```

### Memoization
```typescript
import { useMemo, useCallback } from 'react';

function ExpensiveComponent({ data }) {
  const processedData = useMemo(() => {
    return data.map(item => /* expensive operation */);
  }, [data]);

  const handleClick = useCallback(() => {
    /* handler logic */
  }, []);

  return <div>{/* render */}</div>;
}
```

## HIPAA Compliance

### Protected Health Information (PHI)

- PHI is **never** persisted in localStorage or sessionStorage
- Only UI preferences and non-sensitive data are cached
- All API requests use HTTPS
- Authentication tokens are stored in sessionStorage only
- Sensitive data is excluded from state persistence

### Audit Logging

All PHI access is logged:
```typescript
useEffect(() => {
  auditLog.log({
    userId: user.id,
    action: 'VIEW_INCIDENT_REPORT',
    resourceId: reportId,
    timestamp: new Date().toISOString(),
  });
}, [reportId, user.id]);
```

## Browser Support

- Chrome (last 2 versions)
- Firefox (last 2 versions)
- Safari (last 2 versions)
- Edge (last 2 versions)

## Accessibility

The application follows WCAG 2.1 AA standards:
- Semantic HTML
- ARIA labels and attributes
- Keyboard navigation support
- Screen reader compatibility
- Color contrast compliance

## Contributing

### Code Style

- Follow ESLint and Prettier configurations
- Use TypeScript strict mode
- Write tests for new features
- Update documentation

### Git Workflow

1. Create feature branch from `master`
2. Make changes and write tests
3. Run linting and tests
4. Submit pull request with clear description
5. Address review feedback

### Commit Messages

Follow conventional commits:
```
feat: add incident report filtering
fix: resolve authentication token refresh
docs: update state management guide
test: add tests for witness statements
chore: update dependencies
```

## Troubleshooting

### Common Issues

**Port already in use**
```bash
# Kill process on port 5173
npx kill-port 5173
```

**Module not found**
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

**TypeScript errors**
```bash
# Restart TypeScript server in VS Code
Cmd/Ctrl + Shift + P -> "TypeScript: Restart TS Server"
```

**Build errors**
```bash
# Clear Vite cache
rm -rf node_modules/.vite
npm run dev
```

## Resources

### Official Documentation
- [React Documentation](https://react.dev/)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [Redux Toolkit Documentation](https://redux-toolkit.js.org/)
- [TanStack Query Documentation](https://tanstack.com/query/latest)
- [React Router Documentation](https://reactrouter.com/)
- [Tailwind CSS Documentation](https://tailwindcss.com/)

### Project Documentation
- [Main Project README](../README.md)
- [Backend API Documentation](../backend/README.md)
- [Project Guidelines (CLAUDE.md)](../CLAUDE.md)
- [Changelog](../CHANGELOG.md)

## License

Copyright 2025 White Cross Healthcare Platform. All rights reserved.

---

**For detailed implementation guides, see:**
- [Integration Complete Guide](./src/INTEGRATION_COMPLETE.md)
- [State Management Architecture](./src/STATE_MANAGEMENT_ARCHITECTURE.md)
- [Testing Guide](./src/TESTING_GUIDE.md)
- [Quick Start Guide](./src/QUICK_START.md)

**Last Updated:** October 11, 2025
**Version:** 1.0.0
